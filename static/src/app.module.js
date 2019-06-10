/**
 * Created by nekmo on 10/06/17.
 */


var eventDatetime = new Date('2019-06-11 18:00');

Promise.all([
    require('angular'),
    require('siddii/angular-timer'),
    require('angular-moment'),
    require('angular-sanitize'),
    require('videogular/bower-videogular')
]).then(function () {
    var module = angular.module('e3App', ['timer', 'angularMoment', 'ngSanitize', 'com.2fdevs.videogular']);

    module.constant('eventDatetime', eventDatetime);

    require('components/e3/e3Controller');
    require('components/media/mediaController');
});
