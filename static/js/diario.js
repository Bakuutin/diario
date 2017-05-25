// TODO: highlight added day
// TODO: '+' does not disappear from calendar

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
            const contentHeight = $("#list-of-days").innerHeight();
            const scrollTop = raw.scrollTop;
            const sh = raw.scrollHeight;
            const viewportHeight = $(window).height();
            if (scrollTop <= 100 && !scope.loading) { // load more days before you hit the top
                console.log("load top");
                const promise = scope.loadMoreTop();
                if (promise !== undefined) {
                    promise.then(() => {  // scroll when data is loaded
                        setTimeout(function () {  // wait till data is loaded. I don't know better way :(
                            raw.scrollTop = raw.scrollHeight - sh;
                        }, 0);
                    });
                }
            }
            else if (contentHeight - scrollTop - viewportHeight <= 100) { // if scroll to bottom
                console.log("load bottom");
                scope.loadMoreBottom();
            }
        });
    };
}]);

diario.controller("Days", function ($scope, $http, $timeout) {
    $scope.days = [];
    $scope.loading = 1;
    let nextTop = '/api/days/?limit=15&reverse=true';
    let nextBottom = null;

    const calendar = new dhtmlXCalendarObject("calendar");
    calendar.show();

    calendar.attachEvent("onClick", function (date) {  // create new day or scroll to existing
        date = calendar.getFormatedDate("%Y-%m-%d", date);
        $scope.$apply(function () {
            $http.get('/api/days/' + date).then(function successCallback() {  // try to get day
                console.log('day exists');
                scrollToDay(date);

            }, function errorCallback() {  // if date does not exist
                createDay(date);
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
        const day = calendar.getFormatedDate("%d", date);
        if (day[0] === '0') {  // if number of day starts with 0
            elem.innerHTML = day[1];
        }
        else {
            elem.innerHTML = day;
        }
    });

    function createDay(date) {
        console.log('create new day');
        const newDay = {
            date: date,
            title: "New Title",
            text: "hello"
        };
        $http.post('/api/days/', newDay).then(() => {
            scrollToDay(date);
        });
    }

    function scrollToDay(date) {
        nextTop = '/api/days/?limit=10&reverse=true&date_to=' + date;
        nextBottom = '/api/days/?limit=10&date_from=' + date;
        $scope.days = [];  // clear dom
    }

    $scope.loadMoreTop = function () {
        console.log("load more");
        if (nextTop === null) {
            return;
        }
        $scope.loading = true;
        return $http.get(nextTop).then((responseTop) => {
            const data = responseTop.data;
            nextTop = data.next;
            data.results.reverse();
            $scope.days = data.results.concat($scope.days);
            $scope.loading = false;
        });
    };

    $scope.loadMoreBottom = function () {
        if (nextBottom === null) {
            return;
        }
        return $http.get(nextBottom).then((responseBottom) => {
            const data = responseBottom.data;
            data.results.shift();
            nextBottom = data.next;
            $scope.days = $scope.days.concat(data.results);
        });
    };

    $scope.loadMoreTop().then(() => {
        $timeout(function () {  // scroll to bottom
            const scroller = document.getElementById("fixed");
            scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
    });
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

