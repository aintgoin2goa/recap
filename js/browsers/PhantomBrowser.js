var child_process = require("child_process");

var Q = require("q");

var PhantomBrowser = (function () {
    function PhantomBrowser() {
        this.eventHandlers = {};
        this.status = "IDLE";
    }
    PhantomBrowser.prototype.execute = function (scriptPath) {
        var _this = this;
        var child = child_process.spawn("phantomjs", [scriptPath]);
        child.on("error", function (err) {
            return _this.onError(err);
        });
        child.on("exit", function () {
            return _this.onExit();
        });
        child.stdout.on("data", function (data) {
            return _this.onMessage(data);
        });
        this.instance = child;
    };

    PhantomBrowser.prototype.close = function () {
        this.instance.disconnect();
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
        this.status = "ERROR";
        this.fire("error", err, null);
    };

    PhantomBrowser.prototype.onExit = function () {
        this.status = "COMPLETE";
        this.fire("complete", null, null);
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

