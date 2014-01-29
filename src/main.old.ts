/// <reference path="IConfig.ts" />
/// <reference path="ITempDir.ts" />
/// <reference path="screenshotAdaptors/IScreenshotAdaptor.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="IConsole.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />

import Q = require("q");

import PhantomAdaptor = require("screenshotAdaptors/PhantomAdaptor");
import ScreenshotAdaptorFactory = require("screenshotAdaptors/screenshotAdaptorFactory");
import Config = require("./Config");
import TempDir = require("./TempDir");
import DestinationResolver = require("destinations/DestinationResolver");
import transport = require("transports/transportFactory");
import ConfigGenerator = require("./ConfigGenerator");
import path = require("path");
import fs = require("fs");
var rimraf = require("rimraf");

var console: IConsole = require("./Console");

var cnfg: IConfig;
var factory: ScreenshotAdaptorFactory<PhantomAdaptor>;
var adaptor: IScreenshotAdaptor;
var tempDir: ITempDir; 
var destination: IDestination;
var urls: string[];
var allUrls: string[];
var url: string;
var widths: number[];
var dfd: Q.Deferred<any>;
var terminal: boolean;

function init(config: string, isTerminal?: boolean): Q.IPromise<any>
function init(config: Object, isTerminal?: boolean): Q.IPromise<any> {
    terminal = isTerminal || false;
    dfd = Q.defer<any>();
    cnfg = Config.load(config);
    console.log("config loaded", cnfg);
    factory = new ScreenshotAdaptorFactory<PhantomAdaptor>(PhantomAdaptor);
    adaptor = factory.getNew();
    tempDir = new TempDir()
    tempDir.ready.then(takeScreenshots, fail);  
    return dfd.promise;
}

function generateConfig(): void {
    ConfigGenerator.generate().then(function (result) {
        if (result) {
            init(result);
        }
    });
}

function fail(...args) {
    adaptor.exit();
    console.error(args);
    if (terminal) {
        process.exit(1);
    } else {
        dfd.reject(args);
    }
}

function succeed(...args) {
    adaptor.exit();
    console.success(args);
    if (terminal) {
        process.exit(0);
    } else {
        dfd.resolve(args);
    }
}

function takeScreenshots(): void {
    urls = Object.keys(cnfg.urls).slice(0);
    allUrls = urls.slice(0);
    widths = cnfg.widths.slice(0);
    adaptor.init()
        .then(function () {
            console.log("Beginning...");
            nextUrl();
        },
        function (err) {
            fail("Failed to initalize adaptor", err);
        });
}

function nextUrl(): void
{
    console.log("nextUrl", urls);
    if (urls.length == 0 && widths.length == 0) {
        adaptor.exit();
        copyFiles();
        return;
    }

    url = urls.shift(); 
    widths = cnfg.widths.slice(0);
    console.log("opening new page");
    adaptor.open().then(nextScreenshot, fail);
}

function nextScreenshot()
{
    tempDir.saveRecords();
    if(widths.length === 0){
        console.log("Closing page");
        adaptor.close().then(nextUrl);
        return;
    }

    var width = widths.shift(); 
    console.warn("Next screenshot: " + url + " width: " + width); 
    takeScreenshot(url, width).then(nextScreenshot, fail);   
}

function takeScreenshot(url: string, width: number): Q.IPromise<boolean> {
    var dfd: Q.Deferred<boolean> = Q.defer();
    var filename = tempDir.createRecord(url, width);
    console.log("set viewport width to " + width);
    adaptor.setViewPortSize(width, width)
    .then(
        function(){
            console.log("Navigate to " + url);
            return adaptor.navigate(url, cnfg.urls[url].waitTime);
        },
        fail
    )
    .then(
        function(){
            if(cnfg.urls[url].crawl && width === cnfg.widths[0]){
                console.log("Crawl page for other urls");
                return adaptor.crawl();
            }
            // if we're not crawling the page for urls, simplys move along to next step
            var dfd = Q.defer();
            setImmediate(function(){
                dfd.resolve(true);
            });
            return dfd.promise;    
        },
        fail
    )
    .then(
        function(urls){
            // if we crawled the page, save the urls we found
            if(urls && urls instanceof Array){
                addUrls(urls, url);
            }

            console.log("Capture page and save to " + filename);
            return adaptor.capture(filename);
        },
        fail
    )
    .then(
        function(){
            dfd.resolve(true);
        },
        fail
    );

    return dfd.promise;
}

function addUrls(crawledUrls: string[], parentUrl: string): void
{
    var uniqueUrls = crawledUrls.filter(function(url){
        return allUrls.indexOf(url) == -1;
    });
    urls = urls.concat(uniqueUrls);
    allUrls = allUrls.concat(uniqueUrls);
    crawledUrls.forEach(function(url){
        cnfg.urls[url] = cnfg.urls[parentUrl];
    });
}

function copyFiles() {
    console.log("all screenshots taken, save files to " + cnfg.dest);
    try {
        destination = DestinationResolver.resolve(cnfg.dest);
    } catch (e) {
        fail(e);
    }
    destination.setup().then(
        function () {
            console.log("Copy files to " + destination.uri);
            transport(tempDir).to(destination).then(finish, fail);
        },
        function () {
            fail("Failed to setup destination");
        }
     );
 
}

function finish() {
    tempDir.remove().then(function () {
        succeed("Done.  Your files can be found in " + path.resolve(destination.uri) );
    });
}

function parseArgs(): string[] {
    return process.argv.filter(function (arg) {
        return (arg.indexOf("node") < 0 && arg[0] !== "-" && __filename.indexOf(arg) < 0);
    });
}

function clean(): void
{
    console.log("clean");
    var dir = process.cwd();
    var files: string[] = fs.readdirSync(dir);
    var i = -1;
    var cleanFile = function(f){
        if(f.indexOf("temp") === 0){
            console.log("removing " + f);
            rimraf(path.resolve(f), nextFile);
        }else{
            nextFile();
        }
    }
    var nextFile = function(){
        i++;
        if(i < files.length){
            cleanFile(files[i]);
        }else{
            console.success("Removed temporary directories");
            process.exit();
        }
       
    }
    nextFile();
}




exports.run = init;
exports.generateConfig = generateConfig;
exports.clean = clean;


  