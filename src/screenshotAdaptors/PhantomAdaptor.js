/// <reference path="../d/node.d.ts" />
/// <reference path="../d/node-phantom.d.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="IScreenshotAdaptor.ts" />
var nodePhantom = require("node-phantom");
var Q = require("Q");

var PhantomAdaptor = (function () {
    function PhantomAdaptor() {
    }
    PhantomAdaptor.prototype.init = function () {
        var _this = this;
        var dfd = Q.defer();
        nodePhantom.create(function (err, phantom) {
            if (err) {
                dfd.reject(err);
                return;
            }
            _this.phantom = phantom;
            _this.OnCreate(phantom, dfd);
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

    PhantomAdaptor.prototype.open = function (url) {
        var dfd = Q.defer();
        this.page.open(url, function (err, status) {
            if (err) {
                dfd.reject(err);
            } else {
                setTimeout(function () {
                    dfd.resolve(status);
                }, 10);
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
        var _this = this;
        var dfd = Q.defer();
        this.page.close(function () {
            _this.phantom.exit(function () {
                console.log("Phantom exited");
                dfd.resolve(true);
            });
        });
        return dfd.promise;
    };

    PhantomAdaptor.prototype.OnCreate = function (phantom, dfd) {
        var _this = this;
        console.log("Created instance of phantom");
        phantom.createPage(function (err, page) {
            if (err) {
                dfd.reject(err);
                return;
            }
            _this.OnPageCreate(page, dfd);
        });
        phantom.on("exit", function () {
            _this.OnExit();
        });
    };

    PhantomAdaptor.prototype.OnPageCreate = function (page, dfd) {
        this.page = page;
        console.log("page created");
        dfd.resolve(true);
    };

    PhantomAdaptor.prototype.OnExit = function () {
        console.log("Phantom exited");
    };

    PhantomAdaptor.prototype.OnPageClose = function () {
    };
    return PhantomAdaptor;
})();


module.exports = PhantomAdaptor;

//# sourceMappingURL=PhantomAdaptor.js.map
