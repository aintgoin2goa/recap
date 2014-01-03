/// <reference path="ITempDir.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />
/// <reference path="d/tmp.d.ts" />
var fs = require("fs");
var path = require("path");
var Q = require('q');
var tmp = require('tmp');
var rimraf = require("rimraf");

var TempDir = (function () {
    function TempDir() {
        var _this = this;
        this.dirBase = "temp";
        this.extension = ".jpg";
        this.ready = this.createTempDir();
        this.records = [];
        process.on("exit", function () {
            _this.remove();
        });
    }
    TempDir.prototype.createRecord = function (url, width) {
        var filename = url.replace(/(http|https):\/\//, '').replace(/\//g, '_');
        filename = filename + "_" + width.toString() + this.extension;
        var record = {
            filename: filename,
            url: url,
            width: width,
            date: new Date()
        };
        this.records.push(record);
        return this.dir + path.sep + filename;
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

    TempDir.prototype.listFiles = function () {
        var _this = this;
        return fs.readdirSync(this.dir).map(function (file) {
            return _this.dir + path.sep + file;
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
    return TempDir;
})();


module.exports = TempDir;

//# sourceMappingURL=TempDir.js.map
