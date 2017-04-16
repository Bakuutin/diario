const green = '#138248';

const diario = angular.module('diario', []);

diario.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('((');  // django uses curvy brackets
    $interpolateProvider.endSymbol('))');
});

diario.directive('whenScrolled', ['$timeout', function () {
    return function (scope, elm, attr) {
        const raw = elm[0];  // it is outer div which contains the directive

        elm.bind('scroll', function () {  // when scroll to top
            if (scope.creatingNewDay === true) {
                return;
            }
            if (raw.scrollTop <= 100 && !scope.loading) { // load more days before you hit the top
                const sh = raw.scrollHeight;
                const promise = scope.$apply(attr.whenScrolled);  // apply function loadMore()
                promise.then(() => {  // scroll when data is loaded
                    setTimeout(function () {  // wait till data is loaded. I don't know better way :(
                        raw.scrollTop = raw.scrollHeight - sh;
                    }, 0);
                });
            }
        });
    };
}]);

diario.controller("Days", function ($scope, $http, $timeout) {
    $scope.days = [];
    $scope.loading = 1;
    $scope.next = '/api/days/?limit=15&reverse=true';
    $scope.creatingNewDay = false;

    $scope.scrollToBottom = function () {
        $timeout(function () {  // scroll to bottom
            const scroller = document.getElementById("fixed");
            scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
    };

    const calendar = new dhtmlXCalendarObject("calendar");
    calendar.show();

    calendar.attachEvent("onClick", function (date) {  // create new day or scroll to existing
        date = calendar.getFormatedDate("%Y-%m-%d", date);
        $scope.$apply(function () {
            $http.get('/api/days/' + date).then(function successCallback(response) {  // try to get day
                console.log('day exists');

            }, function errorCallback(response) {  // if date does not exist
                $scope.createDay(date);
            });
        });
    });

    function getDay(date) {
        return $http.get('/api/days/' + date);
    }

    calendar.attachEvent("onMouseOver", function (date, ev) {  // show if day can be created
        date = calendar.getFormatedDate("%Y-%m-%d", date);
        getDay(date).then(
            function successCallback(response) {  // if day already exists

            },
            function errorCallback(response) {  // if date does not exist
            const elem = ev.toElement;
            elem.classList.add('addDay');
            elem.innerHTML = "+";
        });
    });

    calendar.attachEvent("onMouseOut", function (date, ev) {  // clear style when mouse is over
        const elem = ev.fromElement;
        day = calendar.getFormatedDate("%d", date);
        if (day[0] === '0') {  // if number of day starts with 0
            elem.innerHTML = day[1];
        }
        else {
            elem.innerHTML = day;
        }
    });

    $scope.createDay = function (date) {
        $scope.creatingNewDay = true;
        console.log('create new day');
        const newDay = {
            date: date,
            title: "New Title",
            text: "hello"
        };
        $scope.days = [newDay];
        $http.get('/api/days/?limit=10&date_from=' + date).then((response) => {  // load days after new day
            data = response.data;
            if (data.count !== 0) {
                $scope.days = $scope.days.concat(data.results);
            }
        });
        $http.get('/api/days/?limit=10&reverse=true&date_to=' + date).then((response) => {  // load days before new day
            data = response.data;
            if (data.count !== 0) {
                // delete earliest day (otherwise it will be loaded second time by loadMore()):
                const earliestDay = data.results.pop();
                $scope.next = '/api/days/?limit=10&reverse=true&date_to=' + earliestDay.date;  // reassing link to next days
                data.results.reverse();
                $scope.days = data.results.concat($scope.days);
            }
            $scope.scrollToBottom();
            $scope.creatingNewDay = false;

        });
        $http.post('/api/days/', newDay);
    };

    $scope.loadMore = function () {
        if ($scope.creatingNewDay === true) {  // in case if scroll is called when days are deleted in createDay function
            return;
        }
        console.log("load more");
        $scope.loading = true;
        return $http.get($scope.next).then((responce) => {
            data = responce.data;
            $scope.next = data.next;
            for (let i = 0; i < data.results.length; i++)
                $scope.days.unshift(data.results[i]);
            $scope.loading = false;

        });
    };

    $scope.loadMore();
    $scope.scrollToBottom();
});

diario.directive("contenteditable", function ($http) {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
                $http.patch('/api/days/' + scope.day.date + "/", {
                    text: scope.day.text,
                    title: scope.day.title
                });
            });
        }
    };
});

