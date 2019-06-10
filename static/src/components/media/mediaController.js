/**
 * Created by nekmo on 11/06/17.
 */


// http://www.lumenvox.com/espanol/products/tts/#
var TIMELEFT_AUDIOS = [
    {timeleft: 90 * 60, file: '90mins.mp3'},
    {timeleft: 75 * 60, file: '75mins.mp3'},
    {timeleft: 60 * 60, file: '60mins.mp3'},
    {timeleft: 45 * 60, file: '45mins.mp3'},
    {timeleft: 30 * 60, file: '30mins.mp3'},
    {timeleft: 15 * 60, file: '15mins.mp3'},
    {timeleft: 10 * 60, file: '10mins.mp3'},
    {timeleft: 7 * 60, file: '7mins.mp3'},
    {timeleft: 5 * 60, file: '5mins.mp3'},
    {timeleft: 4 * 60, file: '4mins.mp3'},
    {timeleft: 3 * 60, file: '3mins.mp3'},
    {timeleft: 2 * 60, file: '2mins.mp3'},
    {timeleft: 60, file: '1mins.mp3'},
    {timeleft: 50, file: '50secs.mp3'},
    {timeleft: 40, file: '40secs.mp3'},
    {timeleft: 30, file: '30secs.mp3'},
    {timeleft: 20, file: '20secs.mp3'},
    {timeleft: 15, file: '15secs.mp3'},
    {timeleft: 10, file: '10secs.mp3'},
    {timeleft: 5, file: '5secs.mp3'}
];

var started = false;


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
            var currentPlaylistTime = total - (countdownSeconds() % total);
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

    module.factory('nextTimeleft', function (countdownSeconds) {
        return function () {
            var countdown = countdownSeconds();
            var data;

            for(var i=0; i < TIMELEFT_AUDIOS.length; i++) {
                audio = TIMELEFT_AUDIOS[i];
                data = {timeout: Math.abs(audio.timeleft - countdown), file: audio.file};

                if(countdown > audio.timeleft){
                    return data;
                }
            }
            // return data;
        }
    });

    module.controller('mediaCtrl', function ($scope, $sce, videoSeek, totalDuration) {
        $scope.scope = $scope;

        console.log(totalDuration() / 60);

        $scope.getSources = function (videoSeek) {
            return [{src: $sce.trustAsResourceUrl('videos/' + videoSeek.video.file), type: "video/mp4"}]
        };

        $scope.setVideo = function (videoSeek) {
            $scope.fullscreen = videoSeek.video.fullscreen;

            angular.element(document.body)[($scope.fullscreen ? 'addClass' : 'removeClass')]('is-fullscreen');

            $scope.config = {
                sources: $scope.getSources(videoSeek)
            };
        };

        $scope.onPlayerReady = function(API) {
            $scope.videoAPI = API;

            if(!started) {
                API.setVolume(0);

                function restoreVolume() {
                    API.setVolume(100);
                    document.removeEventListener('click', restoreVolume);
                    document.getElementById('unmuted').style.display = 'none';
                }
                document.addEventListener('click', restoreVolume);
            }
            API.seekTime(currentVideoSeek.seek);
            API.play();
        };

        $scope.onCompleteVideo = function () {
            var currentVideoSeek = videoSeek();
            $scope.setVideo(currentVideoSeek);
        };

        var currentVideoSeek = videoSeek();
        $scope.setVideo(currentVideoSeek);
    });

    module.controller('timeleftCtrl', function ($scope, $sce, $timeout, nextTimeleft) {
        $scope.timeleftCtrl = $scope;

        $scope.getSources = function (audio) {
            return [{src: $sce.trustAsResourceUrl('timeleft/' + audio.file), type: "audio/mp3"}]
        };

        $scope.config = {};

        $scope.setAudio = function (audio) {
            $scope.videoAPI.setVolume(.20);
            $scope.config = {sources: $scope.getSources(audio)};
        };

        $scope.onCompleteAudio = function () {
            $scope.videoAPI.setVolume(1);
        };

        $scope.onPlayerReady = function(API) {
            $scope.audioAPI = API;

            API.setVolume(1);
        };

        $scope.setTimeout = function () {
            var next = nextTimeleft();

            if(!next){
                return
            }

            $timeout(function () {
                $scope.setAudio(next);
                $scope.setTimeout();
            }, next.timeout * 1000);
        };

        $scope.setTimeout();
    })
});
