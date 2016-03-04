var Datastore = require('nedb');

module.exports = {
    songs: new Datastore({
        filename: __dirname + '/../database/songs.db',
        autoload: true
    }),

    playlists: new Datastore({
        filename: __dirname + '/../database/playlists.db',
        autoload: true
    })
};