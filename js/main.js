var Q = require("q");
var fs = require("fs");
var BrowserSwarm = require("./browsers/BrowserSwarm");

var fail = function fail(message, dfd) {
    throw new Error("Not implemented");
};

function setupFail(isConsole) {
    if (isConsole) {
        fail = function fail(message, dfd) {
            console.error(message);
            process.exit(1);
        };
    } else {
        fail = function fail(message, dfd) {
            dfd.reject(message);
        };
    }
}

function loadConfig(path) {
    var configstr = fs.readFileSync(path, { encoding: "utf8" });
    var config;
    try  {
        config = JSON.parse(configstr);
    } catch (e) {
        return false;
    }
    return config ? config : false;
}

function setup(config, dfd) {
    var swarm = new BrowserSwarm(config.settings.maxInstances);
}

function run(config, isConsole) {
    var dfd = Q.defer();
    isConsole = isConsole || false;
    setupFail(isConsole);

    if (typeof config === "string") {
        config = loadConfig(config);
        if (!config) {
            fail("Could not parse config object", dfd);
        }
    }

    setup(config, dfd);
    return dfd.promise;
}
exports.run = run;

