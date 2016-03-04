module.exports = function(app, globalStorage) {

  var debug        = globalStorage.config.server.debug,
      serverConfig = globalStorage.config.server,
      indexing     = false;



  // Transport the root page
  app.get('/', function(req, res) {
    //res.sendFile('Index.html', {root: serverConfig.templateRootPath});
    res.render('Index');
  });



  // Register new Socket Clients
  globalStorage.io.sockets.on('connection', function(socket) {
    socket.emit('ready', 'youre welcome');

    if ( indexing == true ) {
      socket.emit('indexing', true);
    }

    // Wait for starting index
    socket.on('index', function(data) {
      if ( data.password != globalStorage.config.server.password ) {
        if ( debug ) console.log('WRONG PASSWORD');
        return false;
      }

      // start indexing
      startIndexing();
    });
  });



  // Tell anyone that we're indexing
  var broadcastIndexing = function(data) {
    indexing = data;
    globalStorage.io.sockets.emit('indexing', data);
  }

  // Reindexing
  var startIndexing = function() {
    if ( debug ) console.log('Start indexing...');
    broadcastIndexing(true);

    // Media folder in short
    var mediaFolders = globalStorage.config.server.mediaPaths;

    // delete all covers
    var coverPath = __dirname + '/../../database/covers';
    fs.readdirSync(coverPath).forEach(function (file) {
      if (fs.lstatSync(coverPath + '/' + file).isFile()) {
        if (globalStorage.path.extname(file) != '.jpg') return;

        var cover = coverPath + '/' + file;

        fs.access(cover, fs.R_OK, function (err) {
          fs.unlink(cover, function (err) {
            if (err) console.log(err);
          });
        });
      }
    });

    // clear databases
    globalStorage.config.database.playlists.remove({}, {multi: true});
    globalStorage.config.database.songs.remove({}, {multi: true});

    // Scan for playlists
    mediaFolders.forEach(function(mediaFolder) {
      // Check if media folder exists
      var mediaFolderStat = fs.statSync(mediaFolder);
      if ( !mediaFolderStat.isDirectory() ) return;

      if ( debug ) console.log('MediaFolder: ' + mediaFolder);

      fs.readdirSync(mediaFolder).forEach(function(dirItem, playlistIterator, dirItems) {
        // check if its a folder
        if (fs.lstatSync(mediaFolder + '/' + dirItem).isDirectory()) {
          if ( debug ) console.log('Folder: ' + mediaFolder + '/' + dirItem);

          // Load playlist config if available
          var playlistConfig = {},
              configFile     = mediaFolder + '/' + dirItem + '/config.json';
          fs.access(configFile, fs.R_OK, function(err) {
            if ( !err ) playlistConfig = JSON.parse(fs.readFileSync(configFile));

            // save to database
            globalStorage.config.database.playlists.insert({
              title: ( playlistConfig && playlistConfig.title ) ? playlistConfig.title : dirItem,
              path: mediaFolder + '/' + dirItem,
              config: playlistConfig
            }, function(err, playlist) {
              if ( err ) {
                if ( debug ) console.log('PLAYLIST_ERROR: ' + err);
                return;
              }

              var playlistPath = playlist.path,
                  playlistId   = playlist._id;

              if ( debug ) console.log('Playlist: [' + playlistId + '] ' + playlist.title);

              // Scan in current playlist for songs
              fs.readdirSync(playlistPath).forEach(function(fileName) {
                if (fs.lstatSync(playlist.path + '/' + fileName).isFile()) {
                  if ( debug ) console.log('File: ' + fileName);

                  if ( globalStorage.path.extname(fileName) != globalStorage.config.server.fileExtension ) return;

                  // READ ID3
                  globalStorage.mm(fs.createReadStream(playlistPath + '/' + fileName), { duration: true }, function(err, id3) {
                    if ( err ) {
                      if ( debug ) consoe.log('ID3_ERROR: ' + err);
                      return;
                    }

                    globalStorage.config.database.songs.insert({
                      playlistId: playlistId,
                      fileName: fileName,

                      title: ( id3.title ) ? id3.title : fileName.slice(0, -4),
                      artist: ( id3.artist ) ? id3.artist[0] : '',
                      duration: ( id3.duration ) ? id3.duration : 0,
                      cover: ( id3.picture[0] ) ? true : false
                    }, function (err, song) {
                      if (err) {
                        if (debug) console.log('SONG_ERROR: ' + fileName);
                      }

                      // Write Cover Image
                      if ( id3.picture.length > 0 ) {
                        fs.writeFile(__dirname + '/../../database/covers/' + song._id + '.jpg', id3.picture[0].data, function() {});
                      }

                      if (debug) console.log('Song: [' + song._id + '] ' + song.title + ' / ' + song.artist + ' / ' + song.duration);
                    }); // end of storing song to db
                  }); // end of getting ID3
                }
              }); // end of reading files

              // FINISHED
              if ( playlistIterator == (dirItems.length - 1) ) {
                if ( debug ) console.log('Finished indexing');
                broadcastIndexing(false);
              }

            }); // end of inserting playlist to db
          });
        }
      }); // end of reading folders
    });
  };

};