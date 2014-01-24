var Q = require("q");

var BrowserSwarm = require("./browsers/BrowserSwarm");
var Config = require("./Config");
var TempDir = require("./TempDir");
var TaskQueue = require("./task/TaskQueue");
var Task = require("./task/Task");
var console = require("./Console");

var fail = function fail(message, dfd) {
    throw new Error("Not implemented");
};

var success = function success(message, dfd) {
    throw new Error("Not Implemented");
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

function setupSuccess(isConsole) {
    if (isConsole) {
        success = function succeed(message, dfd) {
            console.success(message);
            process.exit(0);
        };
    } else {
        success = function succeed(message, dfd) {
            dfd.resolve(message);
        };
    }
}

function createTasks(config) {
    var urls = Object.keys(config.urls);
    var tasks = [];
    urls.forEach(function (url) {
        tasks.push(new Task(url, config.widths, config.urls[url]));
    });
    return tasks;
}

function setup(config, dfd) {
    var swarm = new BrowserSwarm(config.settings.maxInstances);
    var tempDir = new TempDir();
    var taskQueue = new TaskQueue(swarm, tempDir);
    var tasks = createTasks(config);
    tasks.forEach(function (task) {
        taskQueue.addTask(task);
    });
    begin(config, taskQueue, dfd);
}

function begin(config, queue, dfd) {
    queue.on("complete", function () {
    });
    queue.process();
}

function run(cfg, isConsole) {
    var dfd = Q.defer();
    isConsole = isConsole || false;
    setupFail(isConsole);
    var config = Config.load(cfg);
    setup(config, dfd);
    return dfd.promise;
}
exports.run = run;

