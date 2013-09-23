define(["require", "exports", "node-phantom"], function(require, exports, __phantom__) {
    /// <reference path="d/node.d.ts" />
    /// <reference path="d/node-phantom.d.ts" />
    /// <reference path="d/rimraf.d.ts" />
    var phantom = __phantom__;
    var rimraf = require("rimraf");

    var urls = [
        "http://nissan.co.th/",
        "http://www.footlocker.eu/ns/kdi/gb/en/index.html",
        "http://www.audiusa.com/"
    ];

    var sizesToCheck = [1900, 1024, 640, 320];

    var url;
    var sizes;
    var dest = "../dest/";
    var ph;
    var page;
    var currentSize;
    var destination = "../dest/";

    function handleError(err) {
        if (!err) {
            return;
        }
        console.error("ERROR", err);
        process.exit(1);
    }

    function generateFilename(url, size) {
        var name = url.replace(/^[a-z]{3,5}:/, '').replace(/\//g, '');
        return name + "_" + size.toString() + ".png";
    }

    function nextUrl() {
        if (urls.length) {
            url = urls.shift();
            sizes = sizesToCheck.slice(0);
            nextSize();
        } else {
            finish();
        }
    }

    function nextSize() {
        currentSize = sizes.shift();
        console.log("change size to " + currentSize);
        page.set("viewportSize", { width: currentSize, height: currentSize }, function () {
            page.open(url, takeScreenshot);
            console.log("opening " + url);
        });
    }

    function takeScreenshot(err) {
        handleError(err);
        var filename = destination + generateFilename(url, currentSize);
        page.render(filename, afterScreenshot);
        console.log("rendering to " + filename);
    }

    function afterScreenshot(err) {
        handleError(err);
        console.log("rendered");
        setTimeout(function () {
            if (!sizes.length) {
                nextUrl();
            } else {
                nextSize();
            }
        }, 1000);
    }

    function start(err, p) {
        handleError(err);
        console.log("created page");
        page = p;
        rimraf(destination, function () {
            console.log("Cleaned destination directory");
            nextUrl();
        });
    }

    function finish() {
        console.log("All done");
        process.exit();
    }

    phantom.create(function (err, p) {
        handleError(err);

        console.log("Created phantom instance");

        ph = p;

        ph.createPage(start);

        ph.on("exit", function () {
            process.exit(1);
        });
    });
});
//@ sourceMappingURL=poc.js.map
