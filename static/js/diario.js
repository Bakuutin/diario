(function () {
    const app = angular.module('diary', ["ngCalendar", 'infinite-scroll']);
    app.config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('((');
        $interpolateProvider.endSymbol('))');
    });

    app.directive("contenteditable", function ($http) {
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

    app.controller("EntriesController", function ($scope, $http) {
        $scope.entries = [];
        $http.get('/api/days').then((responce) => {
            $scope.entries = responce.data;
        });

        $scope.loadMore = function () {
            $http.get('/api/days').then((responce) => {
                console.log(responce.data);
                $scope.entries = $scope.entries.concat(responce.data);
                console.log($scope.entries);
            });
        };
    });
})();

// $(document).ready(function(){
//     $("html, body").animate({ scrollTop: $(document).height() }, 100);
// });
