module.exports = function(app, globalStorage) {

    // getAllAction
    app.get('/api/songs/:playlistId', function(req, res) {
        globalStorage.config.database.songs.find({
            playlistId: req.params.playlistId
        }).sort({fileName:1}).exec(function(err, songs) {
            if ( !err ) res.json(songs);
        });
    });

    // streamSongAction
    app.get('/api/song/:playlistId/:songId', function(req, res) {
        var songId     = req.params.songId,
            playlistId = req.params.playlistId;

        if ( !songId || !playlistId ) return false;

        // get the song file
        globalStorage.config.database.playlists.findOne({_id:playlistId}, function(err, playlist) {
            if ( err || !playlist ) {
                res.status(404).send('404 File not found');
                return;
            }

            globalStorage.config.database.songs.findOne({_id:songId, playlistId:playlistId}, function(err, song) {
                if ( err || !song ) {
                    res.status(404).send('404 File not found');
                    return;
                }

                // setting up the file path
                var file = playlist.path + '/' + song.fileName;

                // check if file exists and the send it to the client
                fs.access(file, fs.R_OK, function(err) {
                    if ( err ) {
                        res.status(404).send('404 File not found');
                        return;
                    }

                    var stat = fs.statSync(file);

                    res.writeHead(200, {
                        'Content-Type': 'audio/mpeg',
                        'Content-Length': stat.size,
                        'Transfer-Encoding': 'chunked'
                    });

                    fs.createReadStream(file).pipe(res);
                });
            });
        });
    });

    app.get('/api/cover/:songId', function(req, res) {
        var songId = req.params.songId;

        if ( !songId ) return false;

        globalStorage.config.database.songs.findOne({_id:songId}, function(err, song) {
            if (err || !song || !song.cover ) {
                res.status(404).send('404 File not found');
                return;
            }

            var cover = __dirname + '/../../database/covers/' + song._id + '.jpg';

            fs.access(cover, fs.R_OK, function(err) {
                if ( err ) {
                    res.status(404).send('404 File not found');
                    return;
                }

                var stat = fs.statSync(cover);

                res.writeHead(200, {
                    'Content-Type': 'image/jpeg',
                    'Content-Length': stat.size,
                    'Transfer-Encoding': 'chunked'
                });

                fs.createReadStream(cover).pipe(res);
            });
        });
    });

};