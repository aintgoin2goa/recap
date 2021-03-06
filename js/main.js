var Q = require("q");

var BrowserSwarm = require("./browsers/BrowserSwarm");
var PhantomBrowser = require("./browsers/PhantomBrowser");
var Config = require("./Config");
var TempDir = require("./TempDir");
var TaskQueue = require("./task/TaskQueue");
var Task = require("./task/Task");
var console = require("./Console");
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

function copyFiles(config, tempDir) {
    var dfd = Q.defer();
    tempDir.saveRecords();
    var destination = DestinationResolver.resolve(config.dest);
    destination.setup().then(function () {
        transport(tempDir).to(destination).then(function () {
            dfd.resolve(true);
        }, function () {
            dfd.reject(false);
        });
    }, function () {
        console.error("Failed to setup destination directory, is it already locked?");
        dfd.reject(false);
    });
    return dfd.promise;
}

function setup(config, dfd) {
    var swarm = new BrowserSwarm(config.settings.maxInstances);
    var tempDir = new TempDir();
    tempDir.ready.then(function () {
        console.log("created temporary directory");
        var taskQueue = new TaskQueue(swarm, tempDir);
        var tasks = createTasks(config);
        tasks.forEach(function (task) {
            taskQueue.addTask(task);
        });
        console.log("Tasks queued, begin processing");
        begin(config, taskQueue, tempDir, dfd);
    });
}

function begin(config, queue, tempDir, dfd) {
    queue.on("complete", function () {
        console.log("All tasks complete - begin copying files");
        copyFiles(config, tempDir).then(function () {
            console.log("Files copied, removing temporary directory");
            tempDir.remove().then(function () {
                success("Operation complete!", dfd);
            }, function () {
                console.error("Failed to remove temporary directory");
            });
        }, function () {
            fail("Failed to copy files to destination " + config.dest, dfd);
        });
    });
    console.info("Setup complete, begin processing...");
    queue.process();
}

function run(cfg, isConsole) {
    var dfd = Q.defer();
    isConsole = isConsole || false;
    setupFail(isConsole);
    setupSuccess(isConsole);

    PhantomBrowser.test().then(function () {
        var config = Config.load(cfg);
        console.log("loaded config");
        setup(config, dfd);
    }, function (version) {
        if (!version) {
            fail("Phantomjs not found.  Is it installed and available in your path?", dfd);
        } else {
            fail("Your phantom version appears to be " + version + "1.7 or greater is required", dfd);
        }
    });

    return dfd.promise;
}
exports.run = run;

function on(event, handler) {
    switch (event) {
        case "console":
            console.on(handler);
            break;
    }
}
exports.on = on;

