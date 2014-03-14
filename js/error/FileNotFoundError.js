var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ErrorBase = require("./ErrorBase");

var FileNotFoundError = (function (_super) {
    __extends(FileNotFoundError, _super);
    function FileNotFoundError(message) {
        _super.call(this, message);
        this.name = "File Not Found";
        this.message = message;
    }
    return FileNotFoundError;
})(ErrorBase);


module.exports = FileNotFoundError;

