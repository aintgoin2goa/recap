require("colors");

var settings = {
    verbose: false,
    enabled: false
};

var eventHandlers;
eventHandlers = [];

function on(handler) {
    eventHandlers.push(handler);
}
exports.on = on;

function trigger(type, content) {
    eventHandlers.forEach(function (handler) {
        handler(type, content);
    });
}

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
    if (settings.enabled) {
        console.log(args.join(", " + "\r\n")[color]);
    }
}

function info() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    trigger("info", args);
    printToScreen(parseArgs(args), "white");
}
exports.info = info;

function warn() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    trigger("warn", args);
    printToScreen(parseArgs(args), "yellow");
}
exports.warn = warn;

function error() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    trigger("error", args);
    printToScreen(parseArgs(args), "red");
}
exports.error = error;

function success() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    trigger("success", args);
    printToScreen(parseArgs(args), "green");
}
exports.success = success;

function log() {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    trigger("log", args);
    if (settings.verbose) {
        printToScreen(parseArgs(args), "white");
    }
}
exports.log = log;

