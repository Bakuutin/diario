(function () {
    const app = angular.module('diary', ["ngCalendar", 'dc.endlessScroll']);
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
        this.entries = [];
        $http.get('/api/days').then((responce) => {
            this.entries = responce.data;
        });
        let that = this;
        // Define a method to load a page of data
        function load(page) {
            // var params = {page: page},
            //     isTerminal = $scope.pagination &&
            //         $scope.pagination.current_page >= $scope.pagination.total_pages &&
            //         $scope.pagination.current_page <= 1;
            //
            // // Determine if there is a need to load a new page
            // if (!isTerminal) {
            //     // Flag loading as started
            //     $scope.loading = true;
            //     console.log($scope);
            //     console.log(params);
            //     // Make an API request
            //     $http.get('/api/days', params)
            //         .then((responce) => {
            //             console.log(responce.data);
            //             // Parse pagination data from the response header
            //             // $scope.pagination = angular.fromJson(headers('x-pagination'));
            //             console.log($scope);
            //             // Create an array if not already created
            //             $scope.entries = $scope.entries || [];
            //
            //             // Append new items (or prepend if loading previous pages)
            //             $scope.entries.push.apply($scope.entries, responce.data);
            $http.get('/api/days').then((responce) => {
                $scope.entries = responce.data;
            });
            // console.log(this);
            // console.log(that);
            // $scope.entries = that.entries;
            console.log($scope.entries);
            //             // console.log($scope);
            //         })
            //         .finally(function () {
            //             // Flag loading as complete
            //             console.log("complete");
            //             $scope.loading = false;
            //         });
            // }
            // $scope.loading = false;
        }

        // Register event handler
        // $scope.$on('endlessScroll:next', function () {
        //     // Determine which page to load
        //     console.log("scroll to bottom");
        //     var page = $scope.pagination ? $scope.pagination.current_page + 1 : 1;
        //
        //     // Load page
        //     load(page);
        // });

        // Load initial page (first page or from query param)
        load(1);
    });
})();

// $(document).ready(function(){
//     $("html, body").animate({ scrollTop: $(document).height() }, 100);
// });
