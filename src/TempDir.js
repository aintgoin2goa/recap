/// <reference path="ITempDir.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path = "d/Q.d.ts" />
var fs = require("fs");
var path = require("path");
var Q = require('q');

var TempDir = (function () {
    function TempDir() {
        this.dirBase = "temp";
        this.extension = ".jpg";
        this.dir = this.createTempDir();
        this.records = [];
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
        var _this = this;
        var dfd = Q.defer();
        fs.readdir(this.dir, function (err, files) {
            if (err) {
                dfd.reject(err);
                return;
            }

            if (files.length) {
                dfd.reject(null);
                return;
            }

            fs.rmdir(_this.dir, function (err) {
                if (err) {
                    dfd.reject(err);
                } else {
                    dfd.resolve(true);
                }
            });
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
        var i = 1;
        var filename = this.dirBase + i.toString();
        while (fs.existsSync(filename)) {
            i++;
            filename = this.dirBase + i.toString();
        }
        fs.mkdirSync(filename);
        return filename;
    };
    return TempDir;
})();


module.exports = TempDir;

//# sourceMappingURL=tempDir.js.map
