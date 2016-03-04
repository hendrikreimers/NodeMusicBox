// Loading dependencies
var express      = require('express'),
    http         = require('http'),
    path         = require('path'),
    datastore    = require('nedb'),
    socket       = require('socket.io');
    fs           = require('fs'),
    mm           = require('musicmetadata');


// Global MVC Helper (like autoloader)
var mvc = require(__dirname + '/Classes/Mvc/App');

// Create the server [Trick to combine Socket.IO and Express]
var app    = module.exports.app = express(),
    server = http.createServer(app),
    io     = socket.listen(server);

// Global Object storage
var globalStorage = {
    http: http,
    path: path,
    datastore: datastore,
    socket: socket,
    io: io,
    fs: fs,
    mm: mm
};

// =====================================================================================================================
//
// We need to be sure that everything is loaded step by step by the autoloader.
// So load anything and let's get started!
//
// =====================================================================================================================
// LOAD CONFIGURATION AND DATABASE
mvc.autoload(path.join(__dirname, '/Configuration'), function(config) {
    globalStorage.config = config;

// =====================================================================================================================
// LOAD CONTROLLER
}).autoload(path.join(__dirname, '/Classes/Controller'), function(controllers) {
    globalStorage.controllers = controllers;

    // Static folder
    app.use(express.static(path.join(globalStorage.config.server.public)));

    for ( var controller in controllers ) {
        controllers[controller](app, globalStorage, io);
    };
});

app.set('views', globalStorage.config.server.templateRootPath);
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Start listening !!!
server.listen(globalStorage.config.server.port);