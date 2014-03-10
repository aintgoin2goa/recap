var fs = require("fs");
var path = require("path");
var _ = require("underscore");

var loadedConfig;

var Config = (function () {
    function Config() {
        this.dest = "../dest/";
        this.options = {
            waitTime: 50,
            crawl: false,
            script: null
        };
        this.settings = {
            maxInstances: 4,
            template: "default"
        };
    }
    return Config;
})();
exports.Config = Config;

function loadFromFilePath(pth) {
    pth = path.normalize(pth);
    var file = fs.readFileSync(pth, { encoding: "utf8" });
    try  {
        return JSON.parse(file);
    } catch (e) {
        console.error("JSON Parse Error", e);
        setTimeout(function () {
            process.exit(1);
        }, 10);
    }
}

function mergeUrlConfig(config, options) {
    for (var option in config.options) {
        if (options[option]) {
            config.options[option] = options[option];
        }
    }

    for (var url in config.urls) {
        config.urls[url] = _.clone(config.options);
        if (options[url]) {
            _.extend(config.urls[url], options[url]);
        }
    }
}

function validate(cfg) {
    if (typeof (cfg) == "string") {
        return exports.validate(loadFromFilePath(cfg));
    }

    cfg = cfg;

    console.log("loaded", cfg);

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

    if (!cfg.urls || !cfg.urls.push) {
        return fail("Config must have an array of urls");
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

    if (cfg.settings) {
        config.settings = cfg.settings;
    }

    config.widths = cfg.widths;
    config.dest = cfg.dest;
    config.urls = Object.create(null);
    cfg.urls.forEach(function (url) {
        config.urls[url] = Object.create(null);
    });
    mergeUrlConfig(config, (cfg.options || Object.create(null)));

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

