/// <reference path="IDestDir.ts" />
var path = require("path");

var DestDir = (function () {
    function DestDir(uri) {
        this.uri = uri;
        this.type = this.getType(uri);
    }
    DestDir.prototype.getFilename = function (tempName) {
        var name = tempName.split(path.sep).pop();
        return this.uri + path.sep + name;
    };

    DestDir.prototype.getType = function (uri) {
        // only one type right now
        return DestinationType.FileSystem;
    };
    return DestDir;
})();


module.exports = DestDir;

//# sourceMappingURL=DestDir.js.map
