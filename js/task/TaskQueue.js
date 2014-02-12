var TaskStatus = require("./TaskStatus");
var console = require("../Console");
var Task = require("./Task");
var _ = require("underscore");

var TaskQueue = (function () {
    function TaskQueue(swarm, tempDir) {
        this.swarm = swarm;
        this.tempDir = tempDir;
        this.queue = [];
        this.running = [];
        this.running.length = swarm.size;
        this.completed = [];
        this.urls = [];
        this.events = {};
        this.addEventListeners();
    }
    Object.defineProperty(TaskQueue.prototype, "length", {
        get: function () {
            return this.queue.length;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(TaskQueue.prototype, "complete", {
        get: function () {
            return this.completed.length;
        },
        enumerable: true,
        configurable: true
    });

    TaskQueue.prototype.addTask = function (task) {
        if (this.hasUrl(task.url)) {
            return;
        }

        task.status = TaskStatus.QUEUED;
        task.generateScript(this.tempDir);
        this.urls.push(task.url);
        this.queue.push(task);
    };

    TaskQueue.prototype.process = function () {
        var i = 0;
        while (i < this.running.length && i < this.queue.length) {
            this.next();
            i++;
        }
    };

    TaskQueue.prototype.on = function (event, handler) {
        if (this.events[event]) {
            this.events[event].push(handler);
        } else {
            this.events[event] = [handler];
        }
    };

    TaskQueue.prototype.next = function () {
        if (this.queue.length === 0) {
            if (!this.hasRunningTasks()) {
                console.log("TaskQueue: complete");
                this.trigger("complete");
            }

            return;
        }

        var task = this.queue.shift();
        var index = this.swarm.execute(task.generatedScript);
        if (index > -1) {
            task.status = TaskStatus.RUNNING;
            this.running[index] = task;
        } else {
            this.queue.push(task);
        }
    };

    TaskQueue.prototype.trigger = function (event) {
        if (!this.events[event]) {
            return;
        }

        this.events[event].forEach(function (handler) {
            handler();
        });
    };

    TaskQueue.prototype.addEventListeners = function () {
        var _this = this;
        this.swarm.on("message", function (message, index) {
            return _this.onMessage(message, index);
        });
        this.swarm.on("error", function (error, index) {
            return _this.onError(error, index);
        });
        this.swarm.on("available", function (index) {
            return _this.onAvailable(index);
        });
    };

    TaskQueue.prototype.onMessage = function (message, index) {
        var _this = this;
        if (console[message.title]) {
            console[message.title](message.content);
        }

        if (message.title === "crawlresult" && message.content.forEach) {
            console.log("crawl result", message.content);
            message.content.forEach(function (url) {
                return _this.addUrl(url, index);
            });
        }

        if (message.title === "filesaved") {
            this.tempDir.createRecord(message.content.url, message.content.width);
        }
    };

    TaskQueue.prototype.onError = function (error, index) {
        console.error(error.message);
        this.taskFailed(index);
        this.next();
    };

    TaskQueue.prototype.onAvailable = function (index) {
        console.log("TaskQueue: browser " + index + " available, process next task");
        this.taskSucceeded(index);
        this.next();
    };

    TaskQueue.prototype.taskFailed = function (index) {
        var task = this.running[index];
        if (task == null) {
            console.error("No task found at index " + index);
            return;
        }
        task.status = TaskStatus.FAILED;
        this.queue.push(task);
        this.running[index] = null;
    };

    TaskQueue.prototype.taskSucceeded = function (index) {
        var task = this.running[index];
        if (task == null) {
            console.error("No task found at index " + index);
            return;
        }
        task.status = TaskStatus.COMPLETE;
        this.completed.push(task);
        this.running[index] = null;
    };

    TaskQueue.prototype.addUrl = function (url, index) {
        index = index || 0;
        var baseTask = this.getBaseTask(index);
        var task = new Task(url, baseTask.widths, baseTask.options);
        this.addTask(task);
        if (this.queue.length) {
            this.next();
        }
    };

    TaskQueue.prototype.getBaseTask = function (index) {
        if (this.running[index]) {
            return this.running[index];
        }

        if (this.completed.length) {
            return this.completed[this.completed.length - 1];
        }

        return this.queue[0];
    };

    TaskQueue.prototype.hasUrl = function (testUrl) {
        var _this = this;
        return this.urls.some(function (url) {
            return _this.matchUrls(url, testUrl);
        });
    };

    TaskQueue.prototype.matchUrls = function (url1, url2) {
        url1 = url1.replace(/\/$/, "");
        url2 = url2.replace(/\/$/, "");
        return (url1 === url2);
    };

    TaskQueue.prototype.hasRunningTasks = function () {
        return this.running.some(function (task) {
            return task != null;
        });
    };
    return TaskQueue;
})();


module.exports = TaskQueue;

