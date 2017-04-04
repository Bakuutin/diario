const diario = angular.module('diario', []);

diario.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('((');
    $interpolateProvider.endSymbol('))');
});

diario.directive('whenScrolled', ['$timeout', function () {
    return function (scope, elm, attr) {
        const raw = elm[0];  // it is outer div with directive

        elm.bind('scroll', function () {
            if (raw.scrollTop <= 100) { // load more entries before you hit the top
                const sh = raw.scrollHeight;
                scope.$apply(attr.whenScrolled);  // diarioly function loadMore()
                raw.scrollTop = raw.scrollHeight - sh;
            }
        });
    };
}]);

diario.controller("Entries", function ($scope, $http, $timeout) {
    $scope.entries = [];
    $scope.allEntries = [];

    $http.get('/api/days').then((responce) => {
        $scope.allEntries = responce.data;
        $scope.loadMore();
        $timeout(function () {  // scroll to bottom
            const scroller = document.getElementById("fixed");
            scroller.scrollTop = scroller.scrollHeight;
        }, 0, false);
    });

    let counter = 0;
    $scope.loadMore = function () {
        for (let i = 0; i < 15; i++) {
            $scope.entries.unshift($scope.allEntries[counter]);
            counter += 1;
        }
    };
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
                $http.patch('/api/days/' + scope.entry.id + "/", {
                    text: scope.entry.text,
                    title: scope.entry.title
                });
            });
        }
    };
});