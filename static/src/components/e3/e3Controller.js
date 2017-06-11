/**
 * Created by nekmo on 10/06/17.
 */


Promise.all([
    require('src/app.module')
]).then(function () {
    var module = angular.module('e3App');

    module.filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
    });

    module.controller('e3Ctrl', function ($scope, $timeout, eventDatetime) {
        $scope.millis = 0;
        $scope.scope = $scope;
        $scope.eventDatetime = eventDatetime.getTime();

        $scope.updateMillis = function () {
            $scope.millis = 1000 - (new Date()).getMilliseconds();
            $timeout($scope.updateMillis, 80);
        };

        $scope.updateDt = function () {
            $scope.dt = new Date();
            $timeout($scope.updateDt, 1000);
        };

        $scope.updateDt();
        $scope.updateMillis();
    });
});
