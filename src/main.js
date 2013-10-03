/// <reference path="./IConfig.ts" />
/// <reference path="./ITempDir.ts" />
/// <reference path="./IDestDir.ts" />
/// <reference path=./ScreenshotAdaptors/IScreenshotAdaptor.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />
var Q = require("q");

var PhantomAdaptor = require("./screenshotAdaptors/PhantomAdaptor");
var ScreenshotAdaptorFactory = require("./screenshotAdaptorFactory");
var Config = require("./config");
var TempDir = require("./tempDir");
var DestDir = require("./DestDir");
var transport = require("./transportFactory");

var cnfg;
var factory;
var adaptor;
var tempDir;
var destDir;
var urls;
var url;
var widths;

function init(config) {
    cnfg = Config.load(config);
    console.log("config loaded", cnfg);
    factory = new ScreenshotAdaptorFactory(PhantomAdaptor);
    adaptor = factory.getNew();
    tempDir = new TempDir();
    takeScreenshots();
}

function fail() {
    console.error("Something went wrong");
    process.exit(1);
}

function takeScreenshots() {
    urls = cnfg.urls;
    widths = cnfg.widths.slice(0);
    adaptor.init().then(function () {
        console.log("Beginning...");
        url = urls.shift();
        takeNextScreenshot();
    }, function () {
        console.error("Failed to initalize adaptor");
    });
}

function takeNextScreenshot() {
    var width;
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

function takeScreenshot(url, width) {
    var dfd = Q.defer();
    var filename = tempDir.createRecord(url, width);
    adaptor.open(url).then(function () {
        console.log("Set Viewport", width);
        return adaptor.setViewPortSize(width, width);
    }, function () {
        dfd.reject(false);
    }).then(function () {
        console.log("Capture ScreenShot");
        return adaptor.capture(filename);
    }, function () {
        dfd.reject(false);
    }).then(function () {
        console.log("Captured");
        dfd.resolve(true);
    }, function () {
        dfd.reject(false);
    });
    return dfd.promise;
}

function copyFiles() {
    console.log("all screenshots taken, now to save files to " + cnfg.dest);
    try  {
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

function parseArgs() {
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

//# sourceMappingURL=main.js.map
