require("colors");

var settings = {
    verbose: false
};

function setConfig(name, value) {
    settings[name] = value;
}
exports.setConfig = setConfig;

function convertToString(obj) {
    if (typeof obj == "string") {
        return obj;
    }
    if (obj instanceof Array) {
        return (obj).join(", ");
    }
    if (typeof obj == "object") {
        return JSON.stringify(obj, null, 2);
    }
    return obj.toString();
}

function parseArgs(args) {
    var parsedArgs = [];
    for (var i = 0, l = args.length; i < l; i++) {
        parsedArgs.push(convertToString(args[i]));
    }
    return parsedArgs;
}

function printToScreen(args, color) {
    console.log(args.join(", " + "\r\n")[color]);
}

function info() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    if (!settings.verbose) {
        return;
    }
    printToScreen(parseArgs(args), "white");
}
exports.info = info;

function warn() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    printToScreen(parseArgs(args), "yellow");
}
exports.warn = warn;

function error() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    printToScreen(parseArgs(args), "red");
}
exports.error = error;

function success() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    printToScreen(parseArgs(args), "green");
}
exports.success = success;

function log() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    exports.info.apply(this, args);
}
exports.log = log;

//# sourceMappingURL=Console.js.map
