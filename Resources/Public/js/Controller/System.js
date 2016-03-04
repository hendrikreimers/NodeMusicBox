// Playlists Controller
angular.module('App').controller('System', ['$scope', '$http', 'Socket', 'VarStorage', 'Player', '$rootScope', function($scope, $http, Socket, VarStorage, Player, $rootScope) {

    $scope.index = function(password) {
        Socket.emit('index', {
            password: password
        });

        $scope.password = '';
    };

    Socket.on('indexing', function(data) {
        if ( data == true ) {
            $rootScope.showIndexing = true;
            $rootScope.$broadcast('stop');
        } else if ( data == false ) {
            $rootScope.showIndexing = false;

            if ( (typeof window.location.reload) == 'function' ) {
                window.location.reload(true);
            } else window.location.href = '/';
        }
    });

}]);