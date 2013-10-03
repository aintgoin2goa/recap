/// <reference path="d/node.d.ts" />
/// <reference path="IConfig.ts" />
var fs = require("fs");
var path = require("path");

var Config = (function () {
    function Config() {
        this.dest = "../dest/";
    }
    return Config;
})();
exports.Config = Config;

function loadFromFilePath(pth) {
    pth = path.normalize(pth);
    var file = fs.readFileSync(pth, { encoding: "utf8" });
    var contents;
    try  {
        return JSON.parse(file);
    } catch (e) {
        console.error("JSON Parse Error", e);
        setTimeout(function () {
            process.exit(1);
        }, 10);
    }
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
    return config;
}
exports.load = load;

//# sourceMappingURL=config.js.map
