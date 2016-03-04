NodeMusicPlayer
===============

![Screenshot](http://stuff.kern23.de/github/nodemusicbox.jpg "Desktop and Mobile (Responsive) view")

Lightweight and simple Music Player to Stream MP3 to Clients.
Based on NodeJS, AngularJS, jQuery and Twitter Bootstrap.

It's my first NodeJS + AngularJS Project, and i've tried it to write it like MVC (Model-View-Controller) and DDD (Domain-Driven-Design).

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

Installation:

      Clone the git or download it
         npm install
      Configure it (Configuration/...)
      Run it:
         node app.js

At the moment it works, but it's not finished! :-)
Hope you enjoy it! Feel free to give me Feedback!

Best
Hendrik

www.kern23.de