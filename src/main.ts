/// <reference path="./IConfig.ts" />
/// <reference path="./ITempDir.ts" />
/// <reference path=./ScreenshotAdaptors/IScreenshotAdaptor.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />

import Q = require("q");

import PhantomAdaptor = require("screenshotAdaptors/PhantomAdaptor");
import ScreenshotAdaptorFactory = require("./screenshotAdaptorFactory");
import Config = require("./config");
import TempDir = require("./TempDir");
import DestinationResolver = require("destinations/DestinationResolver");
import transport = require("transportFactory");
import ConfigGenerator = require("./ConfigGenerator");
var console: IConsole = require("./Console");

var cnfg: IConfig;
var factory: ScreenshotAdaptorFactory<PhantomAdaptor>;
var adaptor: IScreenshotAdaptor;
var tempDir: ITempDir; 
var destination: IDestination;
var urls: string[];
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
    tempDir = new TempDir();  
    takeScreenshots();  
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
    console.error(args);
    if (terminal) {
        process.exit(1);
    } else {
        dfd.reject(args);
    }
}

function succeed(...args) {
    console.success(args);
    if (terminal) {
        process.exit(0);
    } else {
        dfd.resolve(args);
    }
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
        function (err) {
            fail("Failed to initalize adaptor", err);
        });
    
}

function takeNextScreenshot(): void {
    var width: number;
    console.log("Next");
    tempDir.saveRecords();

    if (urls.length == 0 && widths.length == 0) {
        copyFiles();
        return;
    }

    if (widths.length == 0) {
        widths = cnfg.widths.slice(0);
        url = urls.shift();
    }

    width = widths.shift();
    console.warn("Next screenshot: " + url + " width: " + width);
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
    console.log("all screenshots taken, save files to " + cnfg.dest);
    try {
        destination = DestinationResolver.DestinationResolver.resolve(cnfg.dest);
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
        succeed("Done.  Your files can be found in " + destination.uri);
    });
}

function parseArgs(): string[] {
    return process.argv.filter(function (arg) {
        return (arg.indexOf("node") < 0 && arg[0] !== "-" && __filename.indexOf(arg) < 0);
    });
}


exports.run = init;
exports.generateConfig = generateConfig;


  