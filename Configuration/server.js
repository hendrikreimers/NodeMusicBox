module.exports = {
    // show debug on server console
    debug: false,

    // on which port to listen
    port: 80,

    // Base template
    public: __dirname + '/../Resources/Public',
    templateRootPath: __dirname + '/../Resources/Private/Templates',

    // Where are your songs places (the folders are playlists and there you have to store your songs)
    // relative to this file if you use __dirname
    mediaPaths: [
        __dirname + '/../MEDIA/usb0',
        __dirname + '/../MEDIA/usb1'
    ],
    fileExtension: '.mp3',

    // Password for reindexing
    password: 'pimusic'
}