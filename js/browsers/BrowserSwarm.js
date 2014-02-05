var Browser = require("./PhantomBrowser");
var BrowserStatus = require("./BrowserStatus");
var console = require("../Console");

var BrowserSwarm = (function () {
    function BrowserSwarm(maxInstances) {
        this.eventHandlers = {};
        this.browsers = [];
        for (var i = 0; i < maxInstances; i++) {
            var browser = new Browser(i);
            this.addListeners(browser, i);
            this.browsers.push(browser);
        }
    }
    Object.defineProperty(BrowserSwarm.prototype, "size", {
        get: function () {
            return this.browsers.length;
        },
        enumerable: true,
        configurable: true
    });

    BrowserSwarm.prototype.execute = function (script) {
        for (var i = 0, l = this.browsers.length; i < l; i++) {
            if (this.browsers[i].status === BrowserStatus.IDLE) {
                this.browsers[i].execute(script);
                return i;
            }
        }
        return -1;
    };

    BrowserSwarm.prototype.on = function (event, handler) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].push(handler);
        } else {
            this.eventHandlers[event] = [handler];
        }
    };

    BrowserSwarm.prototype.trigger = function (event, err, data, index) {
        if (!this.eventHandlers[event]) {
            return;
        }

        this.eventHandlers[event].forEach(function (handler) {
            if (event === "message") {
                handler(data, index);
            } else if (event === "error") {
                handler(err, index);
            } else if (event === "available") {
                handler(index);
            } else {
                handler(err, data, index);
            }
        });
    };

    BrowserSwarm.prototype.addListeners = function (browser, index) {
        var _this = this;
        browser.on("message", function (message) {
            return _this.onMessage(message, browser, index);
        });
        browser.on("error", function (error) {
            return _this.onError(error, browser, index);
        });
        browser.on("complete", function () {
            return _this.onExit(browser, index);
        });
    };

    BrowserSwarm.prototype.onMessage = function (message, browser, index) {
        this.trigger("message", null, message, index);
    };

    BrowserSwarm.prototype.onError = function (error, browser, index) {
        this.trigger("error", error, null, index);
        browser.close(true);
    };

    BrowserSwarm.prototype.onExit = function (browser, index) {
        console.log("BrowserSwarm: browser at index " + index + "has finished");
        this.trigger("available", null, null, index);
    };
    return BrowserSwarm;
})();


module.exports = BrowserSwarm;

