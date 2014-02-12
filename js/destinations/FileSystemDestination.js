var path = require("path");
var fs = require("fs");
var Q = require('q');
var console = require("../Console");

var FileSystemDestination = (function () {
    function FileSystemDestination(uri) {
        this.dataFile = "data.json";
        this.uri = path.resolve(uri);
        this.dataFilePath = this.uri + path.sep + this.dataFile;
        this.data = [];
        this.dataIndex = {};
        this.lockFilePath = path.resolve(this.uri + path.sep + "LOCKED");
    }
    FileSystemDestination.prototype.setup = function () {
        var dfd = Q.defer();

        console.log("initialising destination");
        fs.mkdir(this.uri, "0777", function (err) {
            if (err) {
                if (err.code == "EEXIST") {
                    console.warn("Destination directory already exists, will attempt to merge");
                } else {
                    console.error("Failed to create destination directory", err);
                    dfd.reject(false);
                    return;
                }
            }

            dfd.resolve(true);
        });

        return dfd.promise;
    };

    FileSystemDestination.prototype.getFilename = function (tempName) {
        var name = tempName.split(path.sep).pop();
        return path.resolve(this.uri + path.sep + name);
    };

    FileSystemDestination.prototype.isLocked = function () {
        return fs.existsSync(this.lockFilePath);
    };

    FileSystemDestination.prototype.lock = function () {
        var _this = this;
        var dfd = Q.defer();
        fs.open(this.lockFilePath, "wx+", "0777", function (err, fd) {
            if (err) {
                dfd.reject(err);
            } else {
                _this.lockFile = fd;
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    };

    FileSystemDestination.prototype.unlock = function () {
        fs.closeSync(this.lockFile);
        fs.unlinkSync(this.lockFilePath);
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
        var data = JSON.stringify(this.data, null, 2);
        fs.writeFile(this.dataFilePath, data, { encoding: "utf8" }, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    };

    FileSystemDestination.prototype.readData = function () {
        var _this = this;
        var dfd = Q.defer();
        fs.readFile(this.dataFilePath, { encoding: "utf8" }, function (err, data) {
            if (data) {
                _this.data = JSON.parse(data);
                fs.unlink(_this.dataFilePath, function () {
                });
                _this.indexData();
            }
            dfd.resolve(null);
        });
        return dfd.promise;
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

