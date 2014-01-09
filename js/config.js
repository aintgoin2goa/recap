var fs = require("fs");
var path = require("path");
var _ = require("underscore");

var loadedConfig;

var Config = (function () {
    function Config() {
        this.dest = "../dest/";
        this.defaultOptions = {
            waitTime: 50,
            crawl: false,
            script: null
        };
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

function mergeUrlConfig(cfg) {
    _.each(cfg.urls, function (value, key) {
        value = value || cfg.defaultOptions;
        _.defaults(value, cfg.defaultOptions);
        cfg.urls[key] = value;
    });
}

function validate(cfg) {
    if (typeof (cfg) == "string") {
        return exports.validate(loadFromFilePath(cfg));
    }

    cfg = cfg;

    var result = {
        result: true,
        message: ""
    };

    var fail = function (msg) {
        result.result = false;
        result.message = msg;
        return result;
    };

    if (!cfg.widths || !cfg.widths.push) {
        return fail("Config file must have an array of widths");
    }

    if (!cfg.dest || typeof (cfg.dest) !== "string") {
        return fail("No valid destination given");
    }
    if (!cfg.urls || _.isArray(cfg.urls) || (Object.keys(cfg.urls).length) === 0) {
        return fail("Urls object not present or empty");
    }

    return result;
}
exports.validate = validate;

function load(cfg) {
    if (typeof (cfg) == "string") {
        return exports.load(loadFromFilePath(cfg));
    }

    var validation = exports.validate(cfg);
    if (!validation.result) {
        throw new Error(validation.message);
    }

    var config = new Config();

    if (cfg.defaultOptions) {
        config.defaultOptions = cfg.defaultOptions;
    }

    config.urls = cfg.urls;
    config.widths = cfg.widths;
    config.dest = cfg.dest;
    mergeUrlConfig(config);
    loadedConfig = config;
    return config;
}
exports.load = load;

function getCurrentConfig() {
    if (loadedConfig == null) {
        throw new Error("No config has been loaded yet");
    }
    return loadedConfig;
}
exports.getCurrentConfig = getCurrentConfig;

