reshot
======

A library for taking screenshots of a url at various widths, to aid development of a responsive site.  Uses phantomjs to generate the screenshots/


Installation
---------------

You will need [node > 0.8](http://nodejs.org/) and [PhantomJS](http://phantomjs.org/) installed. Windows users will need to make sure that phantomjs is accessible in the PATH.  You should be able to do this:

    phantomjs -v
	
If this doesn't work, then read the phantomjs installation docs to find out why.

Once once you have these dependencies up and running run the following command to install reshot 
    
    npm install -g reshot

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
	
reshot can guide you through the process of creating a config file, just type `reshot` to begin.

Once you have a config file you can use it by typing

    reshot [path_to_config]
	
for example, if the config if is the current directory:

    reshot ./config.json
	



