// Playlists Controller
angular.module('App').controller('Playlist', ['$scope', '$http', 'Socket', 'VarStorage', 'Player', '$rootScope', function($scope, $http, Socket, VarStorage, Player, $rootScope) {

    $scope.playlists = [];

    // ==============================================================
    // GLOBAL EVENTS FIRED BY OTHER CONTROLLERS

    // Get playlists
    $http.get('/api/playlist/getAll').success(function(data) {
        $scope.playlists = data;
    }).error(function(data) {
        console.log('Error: ' + data);
    });

    // selectAction
    $scope.select = function(playlistId) {
        $('.playlists .playlist').removeClass('selected');
        $('.playlist#list_' + playlistId).addClass('selected');
        $rootScope.$broadcast('getSongs', playlistId);
        //$rootScope.$broadcast('stop');
    };

}]);