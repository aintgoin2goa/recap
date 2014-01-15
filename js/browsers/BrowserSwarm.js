var Browser = require("./PhantomBrowser");
var BrowserStatus = require("./BrowserStatus");

var BrowserSwarm = (function () {
    function BrowserSwarm(maxInstances) {
        this.browsers = [];
        for (var i = 0; i < maxInstances; i++) {
            this.browsers.push(new Browser());
        }
    }
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
    };
    return BrowserSwarm;
})();


module.exports = BrowserSwarm;

