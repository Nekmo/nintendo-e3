/**
 * Created by nekmo on 11/06/17.
 */

Promise.all([
    require('src/app.module'),
    require('components/media/playlist')
]).then(function () {
    var module = angular.module('e3App');
    var _ = require('lodash');

    module.factory('totalDuration', function () {
        return function () {
            return _.sumBy(playlist, 'duration')
        }
    });

    module.factory('countdownSeconds', function (eventDatetime) {
        return function () {
            return (eventDatetime.getTime() - (new Date()).getTime()) / 1000;
        };
    });

    module.factory('videoSeek', function (countdownSeconds, totalDuration) {
        return function () {
            // TODO: el countdownSeconds va hacia atrás, lo cual tengo que tenerlo en cuenta
            // porque la playlist va hacia delante, pero el tiempo de countdown va hacia atrás
            var total = totalDuration();
            var currentPlaylistTime = total - countdownSeconds() % total;
            var video;
            var currentTime = 0;
            var lastTime = 0;

            for(var i=0; i < playlist.length; i++) {
                video = playlist[i];
                currentTime += video['duration'];
                if(currentTime > currentPlaylistTime){
                    lastTime = currentTime - video.duration;
                    return {video: video, seek: currentPlaylistTime - lastTime};
                }
            }
        };
    });

    module.controller('mediaCtrl', function ($scope, $sce, videoSeek) {
        var currentVideoSeek = videoSeek();
        console.log(currentVideoSeek.seek);

        $scope.scope = $scope;

        $scope.config = {
            sources: [
                {src: $sce.trustAsResourceUrl('videos/' + currentVideoSeek.video.file), type: "video/mp4"}
            ]
        };

        $scope.onPlayerReady = function(API) {
            $scope.API = API;

            // API.play();
            API.seekTime(currentVideoSeek.seek);
        };
    });
});
