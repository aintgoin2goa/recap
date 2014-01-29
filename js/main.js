var Q = require("q");

var BrowserSwarm = require("./browsers/BrowserSwarm");

var TempDir = require("./TempDir");
var TaskQueue = require("./task/TaskQueue");
var Task = require("./task/Task");

var DestinationResolver = require("./destinations/DestinationResolver");
var transport = require("./transports/transportFactory");
var rimraf = require("rimraf");

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

function copyFiles(config, tempDir) {
    var dfd = Q.defer();
    var destination = DestinationResolver.resolve(config.dest);
    destination.setup().then(function () {
        transport(tempDir).to(destination).then(function () {
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
        });
    });
    return dfd.promise;
}

function setup(config, dfd) {
    var swarm = new BrowserSwarm(config.settings.maxInstances);
    var tempDir = new TempDir();
    var taskQueue = new TaskQueue(swarm, tempDir);
    var tasks = createTasks(config);
    tasks.forEach(function (task) {
        taskQueue.addTask(task);
    });
    begin(config, taskQueue, tempDir, dfd);
}

function begin(config, queue, tempDir, dfd) {
    queue.on("complete", function () {
        copyFiles(config, tempDir).then(function () {
            console.log("Files copied, removing temporary directory");
            rimraf(tempDir.dir, function (err) {
                if (err) {
                    console.error("Failed to remove temporary directory");
                }

                success("Operation complete!", dfd);
            });
        }, function () {
            fail("Failed to copy files to destination " + config.dest, dfd);
        });
    });
    queue.process();
}

function run() {
    var path = require("path");
    var installDir;
    try  {
        installDir = require.resolve("recap");
    } catch (e) {
        var qPath = require.resolve("q");
        installDir = path.resolve(qPath, "../", "../", "../");
    }
    console.log(installDir);
}
exports.run = run;

