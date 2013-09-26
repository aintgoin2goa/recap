/// <reference path="d/node.d.ts" />
/// <reference path="IConfig.ts" />
var fs = require("fs");
var path = require("path");

var Config = (function () {
    function Config() {
        this.dest = "../dest/";
        this.tempFolder = "../temp/";
    }
    return Config;
})();
exports.Config = Config;

function loadFromFilePath(pth) {
    pth = path.normalize(pth);
    var file = fs.readFileSync(pth, { encoding: "utf8" });
    return JSON.parse(file);
}

function load(cfg) {
    if (typeof (cfg) == "string") {
        return exports.load(loadFromFilePath(cfg));
    }
    var config = new Config();
    config.urls = cfg.urls;
    config.widths = cfg.widths;
    if (cfg.dest) {
        config.dest = cfg.dest;
    }
    if (cfg.tempFolder) {
        config.tempFolder = cfg.tempFolder;
    }
    return config;
}
exports.load = load;

//# sourceMappingURL=config.js.map
