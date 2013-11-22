/// <reference path="../d/node.d.ts" />
/// <reference path="../d/node-phantom.d.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="IScreenshotAdaptor.ts" />
var nodePhantom = require("node-phantom");
var console = require("../Console");
var Q = require("q");
var configModule = require("../Config");
var config;

var PhantomAdaptor = (function () {
    function PhantomAdaptor() {
    }
    PhantomAdaptor.prototype.init = function () {
        var _this = this;
        var dfd = Q.defer();
        config = configModule.getCurrentConfig();
        this.delay = config.options.waitTime;
        nodePhantom.create(function (err, phantom) {
            if (err) {
                dfd.reject(err);
                return;
            }
            _this.phantom = phantom;
            dfd.resolve(true);
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.setViewPortSize = function (width, height) {
        var dfd = Q.defer();
        this.page.set("viewportSize", { width: width, height: height }, function (err) {
            if (err) {
                console.error("ERROR", err);
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.open = function () {
        var _this = this;
        var dfd = Q.defer();
        this.phantom.createPage(function (err, page) {
            if (err) {
                dfd.reject(err);
                return;
            }
            _this.page = page;
            dfd.resolve(true);
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.navigate = function (url) {
        var _this = this;
        var dfd = Q.defer();
        this.page.open(url, function (err, status) {
            if (err) {
                dfd.reject(err);
                return;
            }

            _this.delayedResolve(dfd);
        });

        return dfd.promise;
    };

    PhantomAdaptor.prototype.crawl = function () {
        console.log("start crawl");
        var dfd = Q.defer();
        var crawlFunc = function () {
            var urls = [];
            var links = document.getElementsByTagName('a');
            for (var i = 0, l = links.length; i < l; i++) {
                if (links[i].href.indexOf(location.hostname) != -1) {
                    urls.push(links[i].href.replace(/#.*$/, ''));
                }
            }
            return urls;
        };
        this.page.evaluate(crawlFunc, function (err, urls) {
            console.log("urls found", urls);
            if (err) {
                console.log(err);
                dfd.reject(err);
            } else {
                dfd.resolve(urls);
            }
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.capture = function (filename) {
        var dfd = Q.defer();
        this.page.render(filename, function (err) {
            if (err) {
                console.error("ERROR", err);
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.close = function () {
        var dfd = Q.defer();
        this.page.close(function () {
            console.log("Page closed");
            dfd.resolve(true);
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.exit = function () {
        var dfd = Q.defer();
        this.phantom.exit(function () {
            dfd.resolve(true);
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.delayedResolve = function (dfd) {
        setTimeout(function () {
            dfd.resolve(true);
        }, this.delay);
    };
    return PhantomAdaptor;
})();


module.exports = PhantomAdaptor;

//# sourceMappingURL=PhantomAdaptor.js.map