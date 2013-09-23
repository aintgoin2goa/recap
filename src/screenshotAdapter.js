/// <reference path="screenshotAdapters/IScreenshotAdapter.ts" />
var ScreenshotAdaptorFactory = (function () {
    function ScreenshotAdaptorFactory(adtp) {
        this.Adaptor = adtp;
    }
    ScreenshotAdaptorFactory.prototype.getNew = function () {
        return new this.Adaptor();
    };
    return ScreenshotAdaptorFactory;
})();
//@ sourceMappingURL=screenshotAdapter.js.map
