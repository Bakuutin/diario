var app = angular.module('diary', ['ui.scroll']);
app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('((');
    $interpolateProvider.endSymbol('))');
});

app.factory('Server', function ($timeout, $q, $http) {
    return {
        max: 199,
        first: 1,
        delay: 100,
        data: [],

        init: function () {
            $http.get('/api/days').then((responce) => {
                this.data = responce.data;
            });
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
    var entries = {};

    Server.init();

    entries.get = function (index, count, success) {
        console.log('index = ' + index + '; count = ' + count);

        var start = index;
        var end = Math.min(index + count - 1, Server.first);

        Server.request(start, end).then(success);
    };

    $scope.entries = entries;

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

