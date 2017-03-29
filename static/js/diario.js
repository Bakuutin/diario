var app = angular.module('diary', ['ui.scroll']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('((');
    $interpolateProvider.endSymbol('))');
});

app.factory('Server', function ($timeout, $q) {
    return {
        max: 199,
        first: 1,
        delay: 100,
        data: [],

        init: function () {
            for (let i = this.first; i <= 50; i++) {
                this.data.push({
                    date: i,
                    title: 'Message #' + i,
                    text: Math.random().toString(36).substring(7)
                });
            }
        },

        request: function (start, end) {
            console.log(start, end);
            var self = this;
            var deferred = $q.defer();

            // return array with entries (part of full array)
            $timeout(function () {
                var result = [];
                if (start <= end) {
                    for (var i = start; i <= end; i++) {
                        var serverDataIndex = (-1) * i + self.first;
                        var item = self.data[serverDataIndex];
                        if (item) {
                            result.push(item);
                        }
                        else {  // generate new entries
                            result.push({
                                date: -i,
                                title: 'Message #' + -i,
                                text: Math.random().toString(36).substring(7)
                            })
                        }
                    }
                }
                deferred.resolve(result);
            }, self.delay);

            return deferred.promise;
        }
    };

});


app.controller('mainController', function ($scope, Server) {
    var datasource = {};

    Server.init();

    datasource.get = function (index, count, success) {
        console.log('index = ' + index + '; count = ' + count);

        var start = index;
        var end = Math.min(index + count - 1, Server.first);

        Server.request(start, end).then(success);
    };

    $scope.entries = datasource;

});

// (function () {
//     const app = angular.module('diary', ["ngCalendar", 'ui.scroll']);
//     app.config(function ($interpolateProvider) {
//         $interpolateProvider.startSymbol('((');
//         $interpolateProvider.endSymbol('))');
//     });
//
//     app.factory('Server', [
//         '$timeout', '$q', function ($timeout, $q) {
//
//             return {
//
//                 max: 99,
//
//                 first: 1,
//
//                 delay: 100,
//
//                 data: [],
//
//                 init: function () {
//                     for (var i = this.first; i <= this.max; i++) {
//                         this.data.push({
//                             number: i,
//                             title: 'Message #' + i,
//                             text: Math.random().toString(36).substring(7)
//                         });
//                     }
//                 },
//
//                 request: function (start, end) {
//                     var self = this;
//                     var deferred = $q.defer();
//
//                     $timeout(function () {
//                         var result = [];
//                         if (start <= end) {
//                             for (var i = start; i <= end; i++) {
//                                 var serverDataIndex = (-1) * i + self.first;
//                                 var item = self.data[serverDataIndex];
//                                 if (item) {
//                                     result.push(item);
//                                 }
//                             }
//                         }
//                         deferred.resolve(result);
//                     }, self.delay);
//
//                     return deferred.promise;
//                 }
//             };
//
//         }
//     ]);
//
//
//     app.controller('mainController', [
//         '$scope', 'Server', function ($scope, Server) {
//             var datasource = {};
//
//             Server.init();
//
//             datasource.get = function (index, count, success) {
//                 console.log('index = ' + index + '; count = ' + count);
//
//                 var start = index;
//                 var end = Math.min(index + count - 1, Server.first);
//
//                 Server.request(start, end).then(success);
//             };
//
//             $scope.datasource = datasource;
//
//         }
//     ]);
//
//     app.directive("contenteditable", function ($http) {
//         return {
//             restrict: "A",
//             require: "ngModel",
//             link: function (scope, element, attrs, ngModel) {
//
//                 function read() {
//                     ngModel.$setViewValue(element.html());
//                 }
//
//                 ngModel.$render = function () {
//                     element.html(ngModel.$viewValue || "");
//                 };
//
//                 element.bind("blur keyup change", function () {
//                     scope.$apply(read);
//                     $http.patch('/api/days/' + scope.entry.id + "/", {
//                         text: scope.entry.text,
//                         title: scope.entry.title
//                     });
//                 });
//             }
//         };
//     });
//
//     app.controller("EntriesController", function ($scope, $http) {
//         $scope.entries = [];
//         $http.get('/api/days').then((responce) => {
//             $scope.entries = responce.data;
//         });
//
//         $scope.loadMore = function () {
//             $http.get('/api/days').then((responce) => {
//                 console.log(responce.data);
//                 $scope.entries = $scope.entries.concat(responce.data);
//                 console.log($scope.entries);
//             });
//         };
//     });
//
//     function myFunction() {
//         console.log("hello");
//     }
//
//
// })();
//
// // $(document).ready(function(){
// //     $("html, body").animate({ scrollTop: $(document).height() }, 100);
// // });
// //
// // var app2 = angular.module('scroll', []);
// //
// // app2.directive('whenScrolled', ['$timeout', function ($timeout) {
// //     return function (scope, elm, attr) {
// //         console.log("start");
// //         console.log(scope);
// //         var raw = elm[0];
// //
// //         $timeout(function () {
// //             raw.scrollTop = raw.scrollHeight;
// //         });
// //
// //         elm.bind('scroll', function () {
// //             if (raw.scrollTop <= 100) { // load more items before you hit the top
// //                 var sh = raw.scrollHeight
// //                 scope.$apply(attr.whenScrolled);
// //                 raw.scrollTop = raw.scrollHeight - sh;
// //             }
// //         });
// //         console.log("stop");
// //         console.log(scope);
// //
// //     };
// // }]);
// //
// // app2.controller("Main", function ($scope) {
// //     $scope.items = [];
// //     // this.items = [{id: 1}, {id: 2}, {id: 3}]
// //
// //     var counter = 0;
// //     $scope.loadMore = function () {
// //         console.log($scope);
// //         for (var i = 0; i < 5; i++) {
// //             $scope.items.unshift({id: counter});
// //             counter += 10;
// //         }
// //     };
// //
// //     $scope.loadMore();
// // })
