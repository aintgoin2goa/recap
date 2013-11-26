recap
======

A library for taking screenshots of a url at various widths, to aid development of a responsive site.  Uses phantomjs to generate the screenshots.

This module is also available as a [Grunt Plugin](https://github.com/aintgoin2goa/grunt-recap/).


Installation
---------------

You will need [node > 0.8](http://nodejs.org/) and [PhantomJS](http://phantomjs.org/) installed. Windows users will need to make sure that phantomjs is accessible in the PATH.  You should be able to do this:

    phantomjs -v
	
If this doesn't work, then read the phantomjs installation docs to find out why.

Once once you have these dependencies up and running run the following command to install reshot 
    
    npm install -g recap


Quickstart
------------

If you just want to see what recap can do run this command to get going immediately

	recap demo

This will walk you through the process a creating a config file, suggesting some defaults.


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
	  	   "crawl" : true // if true this will activate crawl mode
	  }
	}
	
recap can guide you through the process of creating a config file, just type `recap` to begin.

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
	
TroubleShooting
------------------

If anything goes wrong, double-check that you defintely have phantomjs installed.  If that's ok then check you have permission to write to location where you're trying to save the files.  You could use sudo, but I wouldn't recommend it.
	
There's also a verbose mode which will help you to diagnose errors

    recap ./config.json --verbose

