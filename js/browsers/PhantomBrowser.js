var child_process = require("child_process");
var console = require("../Console");
var BrowserStatus = require("./BrowserStatus");

var PhantomBrowser = (function () {
    function PhantomBrowser() {
        this.eventHandlers = {};
        this.testPhantom();
    }
    PhantomBrowser.prototype.execute = function (scriptPath) {
        var _this = this;
        var process = child_process.spawn("phantomjs", [scriptPath]);
        process.on("error", function (err) {
            return _this.onError(err);
        });
        process.on("exit", function () {
            return _this.onExit();
        });
        process.stdout.on("data", function (data) {
            return _this.onMessage(data);
        });
    };

    PhantomBrowser.prototype.close = function () {
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

    PhantomBrowser.prototype.onExit = function () {
        this.status = BrowserStatus.COMPLETE;
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

    PhantomBrowser.prototype.testPhantom = function () {
        child_process.exec("phantomjs -v", {}, function (err, stdout, stderr) {
            if (err) {
                console.error("Phantom js not found, please check it is installed and available in your PATH");
                this.status = BrowserStatus.ERROR;
            } else {
                console.log("Phantom js found - version " + stdout.toString());
                this.status = BrowserStatus.READY;
            }
        });
    };
    return PhantomBrowser;
})();


module.exports = PhantomBrowser;

