/// <reference path="./IConfig.ts" />
/// <reference path="./ITempDir.ts" />
/// <reference path="./IDestDir.ts" />
/// <reference path=./ScreenshotAdaptors/IScreenshotAdaptor.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />

import Q = require("q");

import PhantomAdaptor = require("screenshotAdaptors/PhantomAdaptor");
import ScreenshotAdaptorFactory = require("./screenshotAdaptorFactory");
import Config = require("./config");
import TempDir = require("./tempDir");
import DestDir = require("./DestDir");
import transport = require("transportFactory");

var cnfg: IConfig;
var factory: ScreenshotAdaptorFactory<PhantomAdaptor>;
var adaptor: IScreenshotAdaptor;
var tempDir: ITempDir; 
var destDir: IDestDir;
var urls: string[];
var url: string;
var widths: number[];

function init(config: string): void
function init(config: Object): void {
    cnfg = Config.load(config);
    console.log("config loaded", cnfg);
    factory = new ScreenshotAdaptorFactory<PhantomAdaptor>(PhantomAdaptor);
    adaptor = factory.getNew();
    tempDir = new TempDir();  
    takeScreenshots();  
}

function fail() {
    console.error("Something went wrong");
    process.exit(1);
}

function takeScreenshots(): void {
    urls = cnfg.urls;
    widths = cnfg.widths.slice(0);
    adaptor.init()
        .then(function () {
            console.log("Beginning...");
            url = urls.shift();
            takeNextScreenshot();
        },
        function () {
            console.error("Failed to initalize adaptor");
        });
    
}

function takeNextScreenshot(): void {
    var width: number;
    console.log("Next");
    tempDir.saveRecords();

    if (urls.length == 0 && widths.length == 0) {
        copyFiles();
    }

    if (widths.length == 0) {
        widths = cnfg.widths.slice(0);
        url = urls.shift();
    }

    width = widths.shift();
    console.log("Next screenshot: " + url + " width: " + width);
    takeScreenshot(url, width).then(takeNextScreenshot, fail); 
}

function takeScreenshot(url: string, width: number): Q.IPromise<boolean> {
    var dfd: Q.Deferred<boolean> = Q.defer();
    var filename = tempDir.createRecord(url, width);
    adaptor.open(url)
        .then(function () {
            console.log("Set Viewport", width);
            return adaptor.setViewPortSize(width, width);
        },
        function () {
            dfd.reject(false);
        })

        .then(function () {
            console.log("Capture ScreenShot");
            return adaptor.capture(filename);
        },
        function () {
            dfd.reject(false);
        })

        .then(function () {
            console.log("Captured");
            dfd.resolve(true);
        },
        function () {
            dfd.reject(false);
        });
    return dfd.promise;
}

function copyFiles() {
    console.log("all screenshots taken, now to save files to " + cnfg.dest);
    try {
        destDir = new DestDir(cnfg.dest);
    } catch (e) {
        console.error(e);
    }
    
    console.log("Copy files to " + destDir.uri);
    transport(tempDir).to(destDir).then(finish, fail);
}

function finish() {
    tempDir.remove();
    console.log("Done.  Your files can be found in " + destDir.uri);
    process.exit(0);
}

function parseArgs(): string[] {
    return process.argv.filter(function (arg) {
        return (arg.indexOf("node") < 0 && arg[0] !== "-" && __filename.indexOf(arg) < 0);
    });
}

if (require.main === module) {
    var args = parseArgs();
    var config = args[0];
    init(config);
} else {
    exports.run = init;
}

  