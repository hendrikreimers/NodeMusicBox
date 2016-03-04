NodeMusicPlayer
===============

Lightweight and simple Music Player to Stream MP3 to Clients.
Based on NodeJS, AngularJS, jQuery and Twitter Bootstrap.

Made as Hobby for a Hobby to play Audio from a server in a Sportstudio :-)
As plugin it has a stopwatch (countdown) for workouts.

You can configure it in the "Configuration" folder.

It reads all folders and any Folder becomes a playlist. The Songs in the folder will be added to the playlist.
With a config.json file in a "playlist" folder you can make some specials as shown below:

      {
        "title": "Alternative Title",
        "noAutoplay": true,
        "cssClass": "highlightThePlaylist"
      }