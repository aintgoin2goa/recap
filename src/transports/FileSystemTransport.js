/// <reference path="ITransport.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="../d/node.d.ts" />
var fs = require("fs");
var Q = require("q");
var console = require("../Console");

var FileSystemTransport = (function () {
    function FileSystemTransport() {
        this.waitTime = 5000;
        this.maxAttempts = 5;
        this.attempts = 0;
    }
    FileSystemTransport.prototype.copyFiles = function (dfd) {
        if (dfd === undefined) {
            dfd = Q.defer();
        }

        this.checkForLock(dfd);
        return dfd.promise;
    };

    FileSystemTransport.prototype.checkForLock = function (dfd) {
        this.attempts++;
        if (this.to.isLocked()) {
            this.tryAgain(dfd);
        } else {
            this.start(dfd);
        }
    };

    FileSystemTransport.prototype.tryAgain = function (dfd) {
        var _this = this;
        if (this.attempts === this.maxAttempts) {
            console.error("Destination still locked after " + this.attempts + " attempts.  Giving up...");
            setImmediate(function () {
                dfd.reject(false);
            });
        } else {
            console.warn("Destination is locked, will try again in " + (this.waitTime / 1000) + " seconds");
            setTimeout(function () {
                _this.checkForLock(dfd);
            }, this.waitTime);
        }
    };

    FileSystemTransport.prototype.start = function (dfd) {
        var _this = this;
        this.to.lock().then(function () {
            _this.files = _this.from.listFiles();
            _this.nextFile(dfd);
        });
    };

    FileSystemTransport.prototype.nextFile = function (dfd) {
        var _this = this;
        if (this.files.length == 0) {
            this.to.unlock().then(function () {
                dfd.resolve(true);
            });
            return;
        }
        var file = this.files.shift();
        this.copyFile(file).then(function () {
            _this.nextFile(dfd);
        }, function () {
            dfd.reject(false);
        });
    };

    FileSystemTransport.prototype.copyFile = function (file) {
        var dfd = Q.defer();
        var source = fs.createReadStream(file);
        debugger;
        var destination = fs.createWriteStream(this.to.getFilename(file));
        console.log("Copy " + file + " to " + this.to.getFilename(file));
        source.on("error", function (err) {
            console.error(err);
            dfd.reject(false);
        });

        destination.on("error", function (err) {
            console.error(err);
            dfd.reject(false);
        });

        destination.on("finish", function () {
            console.log("Finished piping " + file);
            dfd.resolve(true);
        });

        source.pipe(destination);

        return dfd.promise;
    };
    return FileSystemTransport;
})();


module.exports = FileSystemTransport;

//# sourceMappingURL=FileSystemTransport.js.map
