var Q = require("q");

var PhantomAdaptor = require("./screenshotAdaptors/PhantomAdaptor");
var ScreenshotAdaptorFactory = require("./screenshotAdaptorFactory");
var Config = require("./Config");
var TempDir = require("./TempDir");
var DestinationResolver = require("./destinations/DestinationResolver");
var transport = require("./transportFactory");
var ConfigGenerator = require("./ConfigGenerator");
var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");

var console = require("./Console");

var cnfg;
var factory;
var adaptor;
var tempDir;
var destination;
var urls;
var allUrls;
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
    tempDir.ready.then(takeScreenshots, fail);
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
    adaptor.exit();
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
    adaptor.exit();
    console.success(args);
    if (terminal) {
        process.exit(0);
    } else {
        dfd.resolve(args);
    }
}

function takeScreenshots() {
    urls = cnfg.urls.slice(0);
    allUrls = cnfg.urls.slice(0);
    widths = cnfg.widths.slice(0);
    adaptor.init().then(function () {
        console.log("Beginning...");
        nextUrl();
    }, function (err) {
        fail("Failed to initalize adaptor", err);
    });
}

function nextUrl() {
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

function nextScreenshot() {
    tempDir.saveRecords();
    if (widths.length === 0) {
        console.log("Closing page");
        adaptor.close().then(nextUrl);
        return;
    }

    var width = widths.shift();
    console.warn("Next screenshot: " + url + " width: " + width);
    takeScreenshot(url, width).then(nextScreenshot, fail);
}

function takeScreenshot(url, width) {
    var dfd = Q.defer();
    var filename = tempDir.createRecord(url, width);
    console.log("set viewport width to " + width);
    adaptor.setViewPortSize(width, width).then(function () {
        console.log("Navigate to " + url);
        return adaptor.navigate(url);
    }, fail).then(function () {
        if (cnfg.options.crawl && width === cnfg.widths[0]) {
            console.log("Crawl page for other urls");
            return adaptor.crawl();
        }

        var dfd = Q.defer();
        setImmediate(function () {
            dfd.resolve(true);
        });
        return dfd.promise;
    }, fail).then(function (urls) {
        if (urls && urls instanceof Array) {
            addUrls(urls);
        }

        console.log("Capture page and save to " + filename);
        return adaptor.capture(filename);
    }, fail).then(function () {
        dfd.resolve(true);
    }, fail);

    return dfd.promise;
}

function addUrls(crawledUrls) {
    var uniqueUrls = crawledUrls.filter(function (url) {
        return allUrls.indexOf(url) == -1;
    });
    urls = urls.concat(uniqueUrls);
    allUrls = allUrls.concat(uniqueUrls);
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
        succeed("Done.  Your files can be found in " + path.resolve(destination.uri));
    });
}

function parseArgs() {
    return process.argv.filter(function (arg) {
        return (arg.indexOf("node") < 0 && arg[0] !== "-" && __filename.indexOf(arg) < 0);
    });
}

function clean() {
    console.log("clean");
    var dir = process.cwd();
    var files = fs.readdirSync(dir);
    var i = -1;
    var cleanFile = function (f) {
        if (f.indexOf("temp") === 0) {
            console.log("removing " + f);
            rimraf(path.resolve(f), nextFile);
        } else {
            nextFile();
        }
    };
    var nextFile = function () {
        i++;
        if (i < files.length) {
            cleanFile(files[i]);
        } else {
            console.success("Removed temporary directories");
            process.exit();
        }
    };
    nextFile();
}

exports.run = init;
exports.generateConfig = generateConfig;
exports.clean = clean;

