/// <reference path="screenshotAdaptors/IScreenshotAdaptor.ts" />
var PhantomAdaptor = require("./screenshotAdaptors/PhantomAdaptor");

var ScreenshotAdaptorFactory = (function () {
    function ScreenshotAdaptorFactory(adtp) {
        this.Adaptor = adtp;
    }
    ScreenshotAdaptorFactory.prototype.getNew = function () {
        return new this.Adaptor();
    };
    return ScreenshotAdaptorFactory;
})();


module.exports = ScreenshotAdaptorFactory;

//@ sourceMappingURL=screenshotAdaptorFactory.js.map
