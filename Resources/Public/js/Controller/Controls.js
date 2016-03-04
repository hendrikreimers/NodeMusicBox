// Playlists Controller
angular.module('App').controller('Controls', ['$scope', '$http', 'Socket', 'VarStorage', 'Player', '$rootScope', function($scope, $http, Socket, VarStorage, Player, $rootScope) {

    $scope.status = 'stopped';
    $scope.currentSong = {};

    // ==============================================================
    // CONTROLLER FUNCTIONS CALLED IN THE ANGULARJS HTML

    // Play/Pause button
    $scope.playswitch = function() {
        if ( $scope.status == 'playing' ) {
            $scope.pause();
        } else $scope.play();
    };

    // Play button
    $scope.play = function() {
        Player.play();
        $scope.status = 'playing';
    };

    // Paus button
    $scope.pause = function() {
        Player.pause();
        $scope.status = 'paused';
    };

    // Previous button
    $scope.prev = function() {
        Player.prev(playerCallback);
    };

    // next button
    $scope.next = function() {
        Player.next(playerCallback);
    };



    // ==============================================================
    // GLOBAL EVENTS FIRED BY OTHER CONTROLLERS

    // If the songs controller says to start we start
    $scope.$on('playSong', function(e, args) {
        buttonsDisable();
        $scope.status = 'playing';

        // Play selected song
        var songItemIndex = $('.songs li.song#song_' + args.songId).data('index');
        var autoPlay      = ( $('.playlists .playlist#list_' + args.playlistId).data('noautoplay') ) ? false : true;

        if ( songItemIndex >= 0 ) Player.loadAndPlaySong(songItemIndex, args.songId, args.playlistId, autoPlay, playerCallback);
    });

    // if someone says to stop we stop
    $scope.$on('stop', function(e, args) {
        $scope.status = 'stopped';
        Player.stop();
        $scope.$apply();
        buttonsDisable();
    });

    // If playlist is switched we need to select the current song
    $scope.$on('highlightCurrentSong', function(e, args) {
        highlightCurrent();
    });

    // If error
    $scope.$on('error', function(e, args) {
        $scope.currentSong = {error: args.error};
        $scope.status = 'stopped';
        $scope.$apply();
    });



    // ==============================================================
    // INTERNAL FUNCTIONS

    // General callback function for Player Service
    var playerCallback = function(result) {
        // enable buttons and highlight the current song
        if ( result == true ) {
            buttonsEnable();
            highlightCurrent();
        } else {
            buttonsDisable();
            $scope.status = 'stopped';
        }
    }

    // enable the control buttons
    var buttonsEnable = function() {
        // Only do it if the songlist has more than one song
        if ( VarStorage.current.songs.length <= 1 ) return;

        // Disable anything
        $('.controls a').removeClass('disabled');

        // On first or last position, no prev/next is usable
        var songItemIndex = $('.songs li.song#song_' + VarStorage.current.songId).data('index');
        if ( songItemIndex == 0 ) $('.controls a.prev').addClass('disabled');
        if ( songItemIndex == (VarStorage.current.songs.length - 1) )  $('.controls a.next').addClass('disabled');
    };

    // disable all controll buttons
    var buttonsDisable = function() {
        $('.controls a').addClass('disabled');
    };

    // highlight the current song
    var highlightCurrent = function() {
        // remove from the last current
        $('.songs li.song.current').removeClass('current');

        // Select the new one
        if ( ('list_' + VarStorage.current.playlistId) == $('.playlists .playlist.selected').attr('id') ) {
            var currentSongItem = $('.songs li.song#song_' + VarStorage.current.songId);

            currentSongItem.addClass('current');

            // Set the current song to the {{status}} variable
            $scope.currentSong = VarStorage.current.songs[VarStorage.current.songIndex];
            $scope.$apply();
        }
    };

}]);