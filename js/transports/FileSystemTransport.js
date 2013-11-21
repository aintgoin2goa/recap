/// <reference path="ITransport.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="../d/node.d.ts" />
/// <reference path="../destinations/IFileSystemDestination.ts" />
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
        console.log("Attempting to lock destination");
        this.to.lock().then(function () {
            console.log("Destination locked succesfully, proceeding...");
            _this.files = _this.from.listFiles();
            _this.nextFile(dfd);
        }, function (err) {
            console.error("Failed to lock destination", err);
            process.exit(1);
        });
    };

    FileSystemTransport.prototype.nextFile = function (dfd) {
        var _this = this;
        if (this.files.length == 0) {
            console.log("All files copied, writing data.json file");
            this.to.writeData().then(function () {
                console.log("unlock destination directory");
                return _this.to.unlock();
            }).then(function () {
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
        if (file.indexOf(this.to.dataFile) != -1) {
            this.readData(file);
            setImmediate(function () {
                dfd.resolve(true);
            });
            return dfd.promise;
        }

        var source = fs.createReadStream(file);
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

    FileSystemTransport.prototype.readData = function (file) {
        var dataStr = fs.readFileSync(file, { encoding: "utf8" });

        if (!dataStr) {
            return;
        }

        var data = JSON.parse(dataStr);
        this.to.updateData(data);
    };
    return FileSystemTransport;
})();


module.exports = FileSystemTransport;

//# sourceMappingURL=FileSystemTransport.js.map
