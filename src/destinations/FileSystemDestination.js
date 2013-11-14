/// <reference path="IDestination.ts" />
/// <reference path="IDestinationType.ts" />
var path = require("path");
var fs = require("fs");
var Q = require('q');
var DestinationType = require("./DestinationType");
var console = require("../Console");

var FileSystemDestination = (function () {
    function FileSystemDestination(uri) {
        this.dataFile = "data.json";
        this.uri = uri;
        this.type = this.getType(uri);
        this.dataFilePath = this.uri + path.sep + this.dataFile;
        this.data = [];
        this.dataIndex = {};
        this.lockFile = this.uri + path.sep + "LOCKED";
    }
    FileSystemDestination.prototype.setup = function () {
        var _this = this;
        if (this.isLocked()) {
            return;
        }
        var dfd = Q.defer();

        // if destination does not exist, create it
        console.log("initialising destination");
        fs.mkdir(this.uri, "0666", function (err) {
            if (err) {
                if (err.code == "EEXIST") {
                    console.warn("Destination directory already exists, will attempt to merge");
                } else {
                    console.error("Failed to create destination directory", err);
                }
            }

            // if we have a data file already, delete the file but store contents in memory
            fs.readFile(_this.dataFilePath, { encoding: "utf8" }, function (err, data) {
                if (data) {
                    _this.data = JSON.parse(data);
                    fs.unlink(_this.dataFilePath, function () {
                    });
                    _this.indexData();
                }
                dfd.resolve(null);
            });
        });

        return dfd.promise;
    };

    FileSystemDestination.prototype.getFilename = function (tempName) {
        var name = tempName.split(path.sep).pop();
        return this.uri + path.sep + name;
    };

    FileSystemDestination.prototype.isLocked = function () {
        return fs.existsSync(this.uri + path.sep + "LOCKED");
    };

    FileSystemDestination.prototype.lock = function () {
        var dfd = Q.defer();
        fs.open(this.lockFile, "wx+", "0666", function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    };

    FileSystemDestination.prototype.unlock = function () {
        var dfd = Q.defer();
        fs.unlink(this.lockFile, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    };

    FileSystemDestination.prototype.updateData = function (data) {
        var _this = this;
        data.forEach(function (value) {
            if (_this.dataIndex[value.filename]) {
                _this.data[_this.dataIndex[value.filename]] = value;
            } else {
                _this.data.push(value);
            }
        });
        this.indexData();
    };

    FileSystemDestination.prototype.writeData = function () {
        var dfd = Q.defer();
        var data = JSON.stringify(this.data);
        fs.writeFile(this.dataFilePath, data, { encoding: "utf8" }, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    };

    FileSystemDestination.prototype.getType = function (uri) {
        // only one type right now
        return DestinationType.FileSystem;
    };

    FileSystemDestination.prototype.indexData = function () {
        var _this = this;
        this.data.forEach(function (value, index) {
            _this.dataIndex[value.filename] = index;
        });
    };
    return FileSystemDestination;
})();


module.exports = FileSystemDestination;

//# sourceMappingURL=FileSystemDestination.js.map
