var child_process = require("child_process");

var BrowserStatus = require("./BrowserStatus");
var Q = require("q");

var PhantomBrowser = (function () {
    function PhantomBrowser(index) {
        this.eventHandlers = {};
        this.status = BrowserStatus.IDLE;
    }
    PhantomBrowser.prototype.execute = function (scriptPath) {
        var _this = this;
        var child = child_process.spawn("phantomjs", [scriptPath]);
        child.on("error", function (err) {
            return _this.onError(err);
        });
        child.on("exit", function (code) {
            return _this.onExit(code);
        });
        child.stdout.on("data", function (data) {
            return _this.onMessage(data);
        });
        this.instance = child;
    };

    PhantomBrowser.prototype.close = function (force) {
        if (force) {
            this.instance.kill();
        } else {
            this.instance.disconnect();
        }
        this.status = BrowserStatus.IDLE;
    };

    PhantomBrowser.prototype.on = function (event, handler) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].push(handler);
        } else {
            this.eventHandlers[event] = [handler];
        }
    };

    PhantomBrowser.prototype.fire = function (event, err, data) {
        if (!this.eventHandlers[event]) {
            return;
        }

        this.eventHandlers[event].forEach(function (handler) {
            if (event === "message") {
                handler(data);
            } else {
                handler(err, data);
            }
        });
    };

    PhantomBrowser.prototype.onError = function (err) {
        this.status = BrowserStatus.ERROR;
        this.fire("error", err, null);
    };

    PhantomBrowser.prototype.onExit = function (code) {
        if (code === 0) {
            this.status = BrowserStatus.IDLE;
            this.fire("complete", null, null);
        } else {
            this.onError(null);
        }
    };

    PhantomBrowser.prototype.onMessage = function (message) {
        var msg;
        try  {
            msg = JSON.parse(message.toString());
            this.fire("message", null, msg);
        } catch (e) {
            msg = message.toString();
            this.fire("log", null, msg);
        }
    };

    PhantomBrowser.test = function () {
        var dfd = Q.defer();
        child_process.exec("phantomjs -v", {}, function (err, stdout, stderr) {
            if (err) {
                dfd.resolve(false);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    };
    return PhantomBrowser;
})();


module.exports = PhantomBrowser;

