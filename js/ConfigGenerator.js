var prompt = require("prompt");
var fs = require("fs");
var path = require("path");
var Q = require('q');

var config = {
    urls: [],
    widths: [],
    dest: "",
    options: {
        waitTime: 5000,
        crawl: false
    }
};

var url = {
    name: "url",
    description: "Please enter a url.",
    required: true,
    default: "http://www.datsun.com/"
};
var widths = {
    name: "widths",
    description: "Please enter the required widths to capture, seperated by commas",
    required: false,
    default: "320,640,1024,1900"
};
var dest = {
    name: "dest",
    description: "Please enter the filepath to save your images",
    required: true,
    default: "./screenshots/"
};

var wait = {
    name: "wait",
    description: "How long would you like to wait for the page to be ready before capturing it?",
    default: 50
};

var crawl = {
    name: "crawl",
    message: "Would you like to enable crawl mode (y/n)?",
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no'
};

var use = {
    name: 'use',
    message: "Would you like to use the config now (y/n)?",
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no'
};

function generate() {
    var dfd = Q.defer();

    promptForUrl().then(function () {
        return promptForWidths();
    }).then(function () {
        return promptForDest();
    }).then(function () {
        return promptForWaitTime();
    }).then(function () {
        return promptForCrawl();
    }).then(function () {
        return saveConfig();
    }).then(function () {
        return promptToUse();
    }).then(function (use) {
        if (use) {
            dfd.resolve(config);
        } else {
            dfd.resolve(false);
        }
    });
    return dfd.promise;
}
exports.generate = generate;

function handleError(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
}

function promptForUrl(dfd) {
    if (dfd === undefined) {
        dfd = Q.defer();
    }

    prompt.get(url, function (err, result) {
        handleError(err);

        config.urls.push(result.url);
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptForWidths() {
    var dfd = Q.defer();
    prompt.get(widths, function (err, result) {
        handleError(err);

        config.widths = result.widths.split(",");
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptForDest() {
    var dfd = Q.defer();
    prompt.get(dest, function (err, result) {
        handleError(err);

        config.dest = result.dest;
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptForWaitTime() {
    var dfd = Q.defer();
    prompt.get(wait, function (err, result) {
        handleError(err);

        config.options.waitTime = result.wait;
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptForCrawl() {
    var dfd = Q.defer();
    prompt.get(crawl, function (err, result) {
        handleError(err);

        config.options.crawl = (result.crawl === "y" || result.crawl === "yes");
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptToUse() {
    var dfd = Q.defer();
    prompt.get(use, function (err, result) {
        handleError(err);

        var useIt = result.use === "y" || result.use === "yes";
        dfd.resolve(useIt);
    });
    return dfd.promise;
}

function saveConfig() {
    var dfd = Q.defer();
    var cnfg = JSON.stringify(config, null, 2);
    fs.writeFile("config.json", cnfg, { encoding: "utf8" }, function (err) {
        handleError(err);

        var location = process.cwd() + path.sep + "config.json";
        console.log("File saved at " + location);
        dfd.resolve(true);
    });
    return dfd.promise;
}

