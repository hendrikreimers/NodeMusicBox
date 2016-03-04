module.exports = function(app, globalStorage) {

    // getAllAction
    app.get('/api/playlist/getAll', function(req, res) {
        globalStorage.config.database.playlists.find({}).sort({title:1}).exec(function(err, playlists) {
            if ( err ) {
                res.status(404).send('404 File not found');
                return;
            }

            res.json(playlists);
        });
    });

};