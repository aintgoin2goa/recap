var fs = require("fs");
var path = require("path");
var Q = require('q');
var tmp = require('tmp');
var console = require("./Console");
var rimraf = require("rimraf");

var TempDir = (function () {
    function TempDir() {
        var _this = this;
        this.dirBase = "temp";
        this.extension = ".jpg";
        this.ready = this.createTempDir();
        this.records = [];
        process.on("exit", function (code) {
            _this.removeSync();
        });
    }
    TempDir.prototype.createRecord = function (url, width) {
        var filename = this.transformUrl(url, width);
        if (this.hasRecordFor(filename)) {
            this.updateRecord(filename, new Date());
        } else {
            var record = {
                filename: filename,
                url: url,
                width: width,
                date: new Date()
            };
            this.records.push(record);
        }

        this.saveRecords();
        return this.dir + path.sep + filename;
    };

    TempDir.prototype.createRecords = function (url, widths) {
        var _this = this;
        widths.forEach(function (width) {
            return _this.createRecord(url, width);
        });
    };

    TempDir.prototype.saveRecords = function () {
        var data = JSON.stringify(this.records, null, 2);
        fs.writeFile(this.dir + path.sep + "data.json", data, { encoding: 'utf8' });
    };

    TempDir.prototype.remove = function () {
        var dfd = Q.defer();
        rimraf(this.dir, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    };

    TempDir.prototype.removeSync = function () {
        rimraf.sync(this.dir);
    };

    TempDir.prototype.listFiles = function (filter) {
        var _this = this;
        var allFiles = fs.readdirSync(this.dir);
        var filtered = filter ? allFiles.filter(function (file) {
            var extension = file.split(".").pop();
            return (!filter.length || filter.indexOf(extension) > -1);
        }) : allFiles;
        return filtered.map(function (file) {
            return _this.dir + path.sep + file;
        });
    };

    TempDir.prototype.hasRecordFor = function (filename) {
        return this.records.some(function (record) {
            return record.filename === filename;
        });
    };

    TempDir.prototype.updateRecord = function (filename, date) {
        this.records.some(function (record) {
            if (record.filename === filename) {
                record.date = date;
                return true;
            }
            return false;
        });
    };

    TempDir.prototype.createTempDir = function () {
        var _this = this;
        var dfd = Q.defer();
        tmp.dir({}, function (err, path) {
            if (err) {
                console.error("Failed to create temporary directory", err);
                process.exit(1);
                return;
            }

            _this.dir = path;
            dfd.resolve(true);
        });
        return dfd.promise;
    };

    TempDir.prototype.transformUrl = function (url, width) {
        var filename = url.replace(/(http|https):\/\//, '').replace(/\/$/, '').replace(/\//g, '_');

        return filename + "_" + width.toString() + this.extension;
    };
    return TempDir;
})();


module.exports = TempDir;

