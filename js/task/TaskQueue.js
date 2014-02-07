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
        if (this.urls.indexOf(task.url) != -1) {
            return;
        }

        task.status = TaskStatus.QUEUED;
        task.generateScript(this.tempDir);
        this.urls.push(task.url);
        this.queue.push(task);
    };

    TaskQueue.prototype.process = function () {
        for (var i = 0, l = this.queue.length; i < l; i++) {
            this.next(i);
        }
    };

    TaskQueue.prototype.on = function (event, handler) {
        if (this.events[event]) {
            this.events[event].push(handler);
        } else {
            this.events[event] = [handler];
        }
    };

    TaskQueue.prototype.next = function (index) {
        if (this.queue.length === 0) {
            console.log("TaskQueue: complete");
            this.trigger("complete");
            return;
        }

        var task = this.queue.shift();
        task.status = TaskStatus.RUNNING;
        this.running[index] = task;
        this.swarm.execute(task.generatedScript);
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
            message.content.forEach(function (url) {
                return _this.addUrl(url);
            });
        }

        if (message.title === "filesaved") {
            this.tempDir.createRecord(message.content.url, message.content.width);
        }
    };

    TaskQueue.prototype.onError = function (error, index) {
        console.error(error.message);
        this.taskFailed(index);
    };

    TaskQueue.prototype.onAvailable = function (index) {
        console.log("TaskQueue: browser available, process next task");
        this.taskSucceeded(index);
        this.next(index);
    };

    TaskQueue.prototype.taskFailed = function (index) {
        var task = this.running[index];
        task.status = TaskStatus.FAILED;
        this.queue.push(task);
        this.running[index] = null;
    };

    TaskQueue.prototype.taskSucceeded = function (index) {
        var task = this.running[index];
        task.status = TaskStatus.COMPLETE;
        this.completed.push(task);
        this.running[index] = null;
    };

    TaskQueue.prototype.addUrl = function (url) {
        var baseTask = this.completed.length ? this.completed[0] : this.queue[0];
        var task = new Task(url, baseTask.widths, baseTask.options);
        this.addTask(task);
    };
    return TaskQueue;
})();


module.exports = TaskQueue;

