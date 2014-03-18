recap
======

A library for taking screenshots of a url at various widths, to aid development of a responsive site.  Uses phantomjs to generate the screenshots.

This module is also available as a [Grunt Plugin](https://github.com/aintgoin2goa/grunt-recap/).


Installation
---------------

You will need [node > 0.8](http://nodejs.org/) and [PhantomJS > 1.7](http://phantomjs.org/) installed. Check that Phantomjs binary  is your $PATH.  You should be able to do this:

    phantomjs -v
	
If this doesn't work, then read the phantomjs installation docs to find out why.

Once once you have these dependencies up and running run the following command to install recap
    
    npm install -g recap


Usage
------

The script requires a config.json script to tell it what urls to capture and at what widths. Here is an example :

	{
	  // the urls to capture
	  "urls": [
		"http://www.audiusa.com/",
		"http://nissan.co.th/",
		"http://www.footlocker.eu/ns/kdi/gb/en/index.html"
	  ],
	  // the widths to dest
	  "widths": [
		"320",
		"640",
		"1024",
		"1900"
	  ],
	  // location to save the images (relative to the current working directory)
	  "dest": "./dest/",
	  "options" : {
	  	   "waitTime" : 50, // will pause for this ammout of time before capturing the page
	  	   "crawl" : true, // if true this will activate crawl mode
	  	   "script" : "script.js" // this is a script you can run to perform automation tasks and/or login and stuff like that.  More on this later
	  }
	}
	
Once you have a config file you can use it by typing

    recap [path_to_config]
	
for example, if the config if is the current directory:

    recap ./config.json

### Using progamatically

Recap can also be used via require.  Simply pass a config object to the `run` method:

	var recap = require("recap");

	recap.run(config);

The run method will return a promise

### Crawl Mode

If crawl mode is enabled each url will be scanned for links.  Any link found pointing to the same domain will be added to the urls to capture.  

You can use this to capture an entire site simply by giving the homepage.
	
Overriding Options
---------------------

In the options field you can also override options for an individual url like so:

	{
	  "widths" : [
	    320,
	    480,
	    640,
	    1024,
	    1900
	  ],
	  "urls" : [
	    "http://www.datsun.com",
	    "http://aneventapart.com/",
	    "http://contentsmagazine.com/"
	  ],
	  "dest" : "dest/",
	  "options" : {
	  	"crawl" : true,
	  	"http://contentsmagazine.com/" : {
	  		"crawl" : false
	  	}
	  }
	}

In this example all urls have the crawl option set to `true` except contentsmagazine.com, where it is overridden to `false`.

TroubleShooting
------------------

If anything goes wrong, double-check that you defintely have phantomjs installed.  If that's ok then check you have permission to write to location where you're trying to save the files.
	
There's also a verbose mode which will help you to diagnose errors

    recap ./config.json --verbose


User Scripts
----------------

If you need to login or do other stuff before or after capturing a screenshot (open a modal window, for example) then you can include a script.  This will run inside phantomjs so check out the [phantom docs](http://phantomjs.org/documentation/) to see what you can do.

Inside your script you have access to a `recap` object - this has a few methods for hooking your code into various points of the process

	recap.beforeAll, recap.beforeEach, recap.afterEach, recap.afterAll

#### beforeAll
Called before the url is loaded - this is the one to use if you need to log in first

#### beforeEach
Called just before the screenhot is taken for each width - use this if you need to open a modal of click on something

#### afterEach
Called just after the screenshot is taken - not sure what you'd use this for, maybe debugging or something

#### afterAll
Called after all screenshots are taken


Each of these is a property so you hook into it like so:

	recap.beforeAll = function(done){
		// do login stuff here
		done();
	}

Each function is passed the done callback as a parameter.  You need to call this when you're finished, otherwise nothing will happen!

There's also a couple of other methods you can use

	recap.message(title, content)

Sends a message back to the system - this allows you to log stuff out to the screen from inside phantom.  title can be 'warn' (will print out yellow), 'success' (will print green) 'info' and 'log' (this will only print out in verbose mode).  You can also use 'error' but this will cause recap to kill the phantom process.

	recap.capture(name, callback)

Will take a screenshot.  The name will be added to the filename so can differentiate it from the standard screenshots.  You can use this to perform automation, taking screenshots as you go.

