const diario = angular.module('diario', []);

diario.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('((');  // django uses curvy brackets
    $interpolateProvider.endSymbol('))');
});

diario.directive('whenScrolled', ['$timeout', function () {
    return function (scope, elm, attr) {
        const raw = elm[0];  // it is outer div which contains the directive

        elm.bind('scroll', function () {  // when scroll to top
            if (raw.scrollTop <= 100 && !scope.loading) { // load more days before you hit the top
                const sh = raw.scrollHeight;
                scope.$apply(attr.whenScrolled);  // apply function loadMore()
                console.log("scroll - sh");
                setTimeout(function () {  // wait till data is loaded. I don't know better way :(
                    raw.scrollTop = raw.scrollHeight - sh;
                }, 300);
            }
        });
    };
}]);

diario.controller("Days", function ($scope, $http, $timeout) {
    $scope.days = [];
    $scope.loading = 1;
    $scope.next = '/api/days/?limit=15&reverse=true';

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

    $scope.createDay = function (date) {
        console.log('create new day');
        const newDay = {
            date: date,
            title: "New Title",
            text: "hello"
        };
        $scope.days = [newDay];
        $.getJSON('/api/days/?limit=10&date_from=' + date, function(data) {
            if (data.count !== 0) {
                $scope.days = $scope.days.concat(data.results);
            }
        });
        $.getJSON('/api/days/?limit=10&reverse=true&date_to=' + date, function(data) {
            if (data.count !== 0) {
                data.results.reverse();
                $scope.days = data.results.concat($scope.days);
            }
        });
        $http.post('/api/days/', newDay);
    };

    $scope.loadMore = function () {
        $scope.loading = true;
        $http.get($scope.next).then((responce) => {
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

