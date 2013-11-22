var prompt = require("prompt");
import fs = require("fs");
import path = require("path");
import Q = require('q');

var config: IConfig = {
    urls: [],
    widths: [],
    dest: "",
    options: {
        waitTime : 5000,
        crawl : false
    }
};

var url = {
    name: "url",
    description: "Please enter a url.  Leave blank to confinue to next step.",
    required: false
}
var widths = {
    name: "widths",
    description: "Please enter the required widths to capture, seperated by commas",
    required: false,
    default: "320,640,1024,1900"
}
var dest = {
    name: "dest",
    description: "Please enter the filepath to save your images",
    required: true,
    default: "./dest/"
}
var use = {
    name: 'use',
    message: "Would you like to use the config now?",
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no',
};


export function generate(): Q.IPromise<any>  {
    var dfd = Q.defer<any>();

    promptForUrl()
        .then(function () {
            return promptForWidths();
        })
        .then(function () {
            return promptForDest();
        })
        .then(function () {
            return saveConfig();
        })
        .then(function () {
            return promptToUse();
        })
        .then(function (use) {
            if (use) {
                dfd.resolve(config);
            } else {
                dfd.resolve(false);
            }
        });
    return dfd.promise;
}

function handleError(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
}

function promptForUrl(dfd?: Q.Deferred<any>): Q.IPromise<any> {
    if (dfd === undefined) {
        dfd = Q.defer<any>();
    }
    
    prompt.get(url, function (err, result) {
        handleError(err);

        if (result.url) {
            config.urls.push(result.url);
            promptForUrl(dfd);
        } else {
            dfd.resolve(true);
        }
    });
    return dfd.promise;
}

function promptForWidths(): Q.IPromise<boolean> {
    var dfd = Q.defer<boolean>();
    prompt.get(widths, function (err, result) {
        handleError(err);

        config.widths = result.widths.split(",");
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptForDest(): Q.IPromise<boolean> {
    var dfd = Q.defer<boolean>();
    prompt.get(dest, function (err, result) {
        handleError(err);

        config.dest = result.dest;
        dfd.resolve(true);
    });
    return dfd.promise;
}

function promptToUse(): Q.IPromise<boolean> {
    var dfd = Q.defer<boolean>();
    prompt.get(use, function (err, result) {
        handleError(err);

        var useIt = result.use === "y" || result.use === "yes";
        dfd.resolve(useIt);
    });
    return dfd.promise;
}

function saveConfig(): Q.IPromise<boolean> {
    var dfd = Q.defer<boolean>();
    var cnfg = JSON.stringify(config, null, 2);
    fs.writeFile("config.json", cnfg, { encoding: "utf8" }, function (err) {
        handleError(err);

        var location = process.cwd() + path.sep + "config.json";
        console.log("File saved at " + location);
        dfd.resolve(true);
    });
    return dfd.promise;
}