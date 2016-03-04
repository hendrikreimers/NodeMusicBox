// Playlists Controller
angular.module('App').controller('Songs', ['$scope', '$http', 'Socket', 'VarStorage', 'Player', '$rootScope', function($scope, $http, Socket, VarStorage, Player, $rootScope) {

    // ==============================================================
    // GLOBAL EVENTS FIRED BY OTHER CONTROLLERS

    // get list of songs in the current playlist
    $scope.loadSongs = function(playlistId) {
        $scope.songs = [];

        $http.get('/api/songs/' + playlistId).success(function(data) {
            $scope.songs = VarStorage.songsInView = data;
        }).error(function(data) {
            console.log('Error: ' + data);
        });
    };

    // say the controls controller to start playing this song
    $scope.playSong = function(songId, playlistId) {
        $rootScope.$broadcast('playSong', {
            songId: songId,
            playlistId: playlistId
        });
    };



    // ==============================================================
    // GLOBAL EVENTS FIRED BY OTHER CONTROLLERS

    // the playlist tell us to load songs for his playlist
    $scope.$on('getSongs', function(e, playlist) {
        $scope.loadSongs(playlist);
    });

    // fired in the html if the songs list has been rendered
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $rootScope.$broadcast('highlightCurrentSong');
    });

}]);