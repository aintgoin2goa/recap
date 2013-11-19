recap
======

A library for taking screenshots of a url at various widths, to aid development of a responsive site.  Uses phantomjs to generate the screenshots.

**Currently, it only works on windows - a version with support for linux and max will follow shortly.**


Installation
---------------

You will need [node > 0.8](http://nodejs.org/) and [PhantomJS](http://phantomjs.org/) installed. Windows users will need to make sure that phantomjs is accessible in the PATH.  You should be able to do this:

    phantomjs -v
	
If this doesn't work, then read the phantomjs installation docs to find out why.

Once once you have these dependencies up and running run the following command to install reshot 
    
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
	  // location to save the images (relative to the cwd)
	  "dest": "./dest/"
	}
	
recap can guide you through the process of creating a config file, just type `recap` to begin.

Once you have a config file you can use it by typing

    recap [path_to_config]
	
for example, if the config if is the current directory:

    recap ./config.json
	
	
TroubleShooting
------------------

If anything goes wrong, double-check that you defintely have phantomjs installed.  If that's ok then you might need to use `sudo` in order for it to write to existing directories in the filesystem.

	sudo recap ./config.json
	
There's also a verbose mode which will help you to diagnose errors

    sudo recap ./config.json --verbose

