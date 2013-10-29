/// <reference path="IDestination.ts" />
/// <reference path="IDestinationType.ts" />
var path = require("path");
var fs = require("fs");
var DestinationType = require("./DestinationType");

var FileSystemDestination = (function () {
    function FileSystemDestination(uri) {
        this.uri = uri;
        this.type = this.getType(uri);
        if (!fs.existsSync(uri)) {
            fs.mkdirSync(uri);
        }
    }
    FileSystemDestination.prototype.getFilename = function (tempName) {
        var name = tempName.split(path.sep).pop();
        return this.uri + path.sep + name;
    };

    FileSystemDestination.prototype.getType = function (uri) {
        // only one type right now
        return DestinationType.FileSystem;
    };
    return FileSystemDestination;
})();


module.exports = FileSystemDestination;

//# sourceMappingURL=FileSystemDestination.js.map
