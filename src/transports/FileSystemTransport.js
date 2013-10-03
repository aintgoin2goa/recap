/// <reference path="ITransport.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="../d/node.d.ts" />
var fs = require("fs");
var Q = require("q");

var FileSystemTransport = (function () {
    function FileSystemTransport() {
    }
    FileSystemTransport.prototype.copyFiles = function () {
        var dfd = Q.defer();
        this.files = this.from.listFiles();
        this.nextFile(dfd);
        return dfd.promise;
    };

    FileSystemTransport.prototype.nextFile = function (dfd) {
        var _this = this;
        if (this.files.length == 0) {
            dfd.resolve(true);
            return;
        }
        var file = this.files.shift();
        this.copyFile(file).then(function () {
            fs.unlink(file, function (err) {
                if (err) {
                    console.error(err);
                    dfd.reject(false);
                } else {
                    _this.nextFile(dfd);
                }
            });
        }, function () {
            dfd.reject(false);
        });
    };

    FileSystemTransport.prototype.copyFile = function (file) {
        var dfd = Q.defer();
        var source = fs.createReadStream(file);
        var destination = fs.createWriteStream(this.to.getFilename(file));

        source.on("error", function () {
            dfd.reject(false);
        });

        destination.on("error", function (err) {
            console.error(err);
            dfd.reject(false);
        });

        destination.on("done", function () {
            dfd.resolve(true);
        });

        source.pipe(destination);

        return dfd.promise;
    };
    return FileSystemTransport;
})();


module.exports = FileSystemTransport;

//# sourceMappingURL=FileSystemTransport.js.map