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
var dfd;
var terminal;

function init(config, isTerminal) {
    terminal = isTerminal || false;
    dfd = Q.defer();
    cnfg = Config.load(config);
    console.log("config loaded", cnfg);
    factory = new ScreenshotAdaptorFactory(PhantomAdaptor);
    adaptor = factory.getNew();
    tempDir = new TempDir();
    takeScreenshots();
    return dfd.promise;
}

function generateConfig() {
    ConfigGenerator.generate().then(function (result) {
        if (result) {
            init(result);
        }
    });
}

function fail() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    console.error(args);
    if (terminal) {
        process.exit(1);
    } else {
        dfd.reject(args);
    }
}

function succeed() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    console.success(args);
    if (terminal) {
        process.exit(0);
    } else {
        dfd.resolve(args);
    }
}

function takeScreenshots() {
    urls = cnfg.urls;
    widths = cnfg.widths.slice(0);
    adaptor.init().then(function () {
        console.log("Beginning...");
        url = urls.shift();
        takeNextScreenshot();
    }, function (err) {
        fail("Failed to initalize adaptor", err);
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
        fail(e);
    }
    destination.setup().then(function () {
        console.log("Copy files to " + destination.uri);
        transport(tempDir).to(destination).then(finish, fail);
    }, function () {
        fail("Failed to setup destination");
    });
}

function finish() {
    tempDir.remove().then(function () {
        succeed("Done.  Your files can be found in " + destination.uri);
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
