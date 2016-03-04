// Global used variable storage
angular.module('Services').factory('Player', ['$rootScope', 'VarStorage', function($rootScope, VarStorage) {

    // ==============================================================
    // VARIABLES AND EVENTS

    // Find the player to control
    var playerEl = document.getElementById('player'),
        playerSrc = $(player).find('source'),
        loadDelay = 0,
        playDelay = 0;

    // Default volume
    playerEl.volume = 1;

    // Play next if song has ended
    playerEl.addEventListener('ended', function() {
        if ( VarStorage.current.autoPlay == false ) {
            $rootScope.$broadcast('stop');
            return;
        }

        _next(function(result) {
            if ( result == true ) $rootScope.$broadcast('highlightCurrentSong');
            if ( result == false ) $rootScope.$broadcast('stop');
        });
    }, false);

    // Check errors
    playerEl.addEventListener('error', function(e) {
        $rootScope.$broadcast('error', {error: '404 File not found'});
    }, true);

    // Start playing if load startet
    playerEl.addEventListener('loadstart', function() {
        $rootScope.$broadcast('progress', {progress: 0});
        _play();
    }, true);

    // Duration status
    playerEl.addEventListener('timeupdate', function() {
        var p = (this.currentTime / this.duration) * 100;
        $rootScope.$broadcast('progress', {progress: p});
    });



    // ==============================================================
    // INTERNAL FUNCTIONS

    // pause playing
    var _pause = function() {
        volumeFade(false, function() {
            playerEl.pause();
        });

        return true;
    };

    // start playing
    var _play = function() {
        playerEl.volume = 0;
        playerEl.play();

        volumeFade(true);

        return true;
    };

    // stop playing
    var _stop = function(callback) {
        playerEl.pause();
        $(playerSrc).attr('src', '');

        VarStorage.current.songId     = null;
        VarStorage.current.playlistId = null;
        VarStorage.current.songIndex  = -1;
        VarStorage.current.autoPlay   = null;

        if ( (typeof callback) == 'function' ) {
            callback(true);
        } else return false;
    };

    // plays previous song
    var _prev = function(callback) {
        if ( VarStorage.current.songIndex == 0 ) {
            if ( (typeof callback) == 'function' ) {
                callback(false);
            } else return false;
        }

        var songItemIndex = VarStorage.current.songIndex - 1,
            songId        = VarStorage.current.songs[songItemIndex]._id,
            autoPlay      = VarStorage.current.autoPlay;

        volumeFade(false, function() {
            _loadAndPlaySong(songItemIndex, songId, VarStorage.current.playlistId, autoPlay, callback);
        }, 500);
    };

    // Plays next song
    var _next = function(callback) {
        if ( VarStorage.current.songIndex == (VarStorage.current.songs.length - 1) ) {
            if ( (typeof callback) == 'function' ) {
                return callback(false);
            } else return false;
        }

        var songItemIndex = VarStorage.current.songIndex + 1;

        if ( songItemIndex <= (VarStorage.current.songs.length - 1) ) {
            var songId   = VarStorage.current.songs[songItemIndex]._id,
                autoPlay = VarStorage.current.autoPlay;

            volumeFade(false, function() {
                _loadAndPlaySong(songItemIndex, songId, VarStorage.current.playlistId, autoPlay, callback);
            }, 500);
        }
    };

    // Timeout / Interval clear
    var _clearTimeouts = function() {
        clearTimeout(loadDelay);
        clearInterval(playDelay);
    };

    // Load a song and start playing
    var _loadAndPlaySong = function(songIndex, songId, playlistId, autoPlay, callback) {
        if ( (!songIndex && !songId && !playlistId)  ) {
            if ( (typeof callback) == 'function' ) {
                callback(false);
            } else return false;
        }

        // set the url
        var url = '/api/song/' + playlistId + '/' + songId;

        // Reset
        _clearTimeouts();

        // Set new source
        _stop();
        $(playerSrc).attr('src', url);

        // Save currently playing
        VarStorage.current.playlistId = playlistId;
        VarStorage.current.songId     = songId;
        VarStorage.current.songIndex  = songIndex;
        VarStorage.current.songs      = VarStorage.songsInView;
        VarStorage.current.autoPlay   = autoPlay;

        // Wait a moment and then load
        loadDelay = setTimeout(function() {
            playerEl.load();

            // Start playing if the song file loaded
            // DEBUG: Now done by loadstart event (chrome on android is slow)
            //playDelay = setInterval(function() {
            //    if ( playerEl.readyState > 0 ) {
            //        _play();
            //    }
            //
            //    _clearTimeouts();
            //}, 250);

            if ( (typeof callback) == 'function' ) {
                callback(true);
            } else return false;
        }, 250);
    };

    // Fade in or out the volume
    var volumeFade = function(on, callback, duration) {
        if ( !duration ) {
            duration = 1000;
        }

        var newVolume = 0.0;
        if ( on == true ) newVolume = 1.0;

        if ( callback ) {
            $(playerEl).stop().animate({volume: newVolume}, 1000, callback);
        } else $(playerEl).stop().animate({volume: newVolume}, duration);
    }



    // ==============================================================
    // SERVICE AVAILABLE FUNCTIONS

    return {
        play: function() {
            return _play();
        },

        pause: function() {
            return _pause();
        },

        stop: function(callback) {
            return _stop(callback);
        },

        prev: function(callback) {
           return _prev(callback);
        },

        next: function(callback) {
            return _next(callback);
        },

        loadAndPlaySong: function(songIndex, songId, playlistId, autoPlay, callback) {
            return _loadAndPlaySong(songIndex, songId, playlistId, autoPlay, callback);
        }
    }
}]);