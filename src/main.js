/// <reference path="./IConfig.ts" />
/// <reference path="./ITempDir.ts" />
/// <reference path=./ScreenshotAdaptors/IScreenshotAdaptor.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />
var Q = require("q");

var PhantomAdaptor = require("./screenshotAdaptors/PhantomAdaptor");
var ScreenshotAdaptorFactory = require("./screenshotAdaptorFactory");
var Config = require("./config");
var TempDir = require("./TempDir");
var DestinationResolver = require("./destinations/DestinationResolver");
var transport = require("./transportFactory");
var ConfigGenerator = require("./ConfigGenerator");
var console = require("./Console");

var cnfg;
var factory;
var adaptor;
var tempDir;
var destination;
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

function generateConfig() {
    ConfigGenerator.generate().then(function (result) {
        if (result) {
            init(result);
        }
    });
}

function fail() {
    console.error("Something went wrong", arguments);
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
    console.log("all screenshots taken, save files to " + cnfg.dest);
    try  {
        destination = DestinationResolver.DestinationResolver.resolve(cnfg.dest);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    destination.setup().then(function () {
        console.log("Copy files to " + destination.uri);
        transport(tempDir).to(destination).then(finish, fail);
    }, function () {
        console.error("Failed to setup destination");
        process.exit();
    });
}

function finish() {
    tempDir.remove().then(function () {
        console.success("Done.  Your files can be found in " + destination.uri);
        process.exit(0);
    });
}

function parseArgs() {
    return process.argv.filter(function (arg) {
        return (arg.indexOf("node") < 0 && arg[0] !== "-" && __filename.indexOf(arg) < 0);
    });
}

exports.run = init;
exports.generateConfig = generateConfig;

//# sourceMappingURL=main.js.map
