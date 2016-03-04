// Global used variable storage
angular.module('Services').factory('VarStorage', function($rootScope) {
    return {
        songsInView: [],

        current: {
            playlistId: -1,
            songId: -1,
            songs: []
        }
    }
});