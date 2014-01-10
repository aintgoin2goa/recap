/// <reference path="./IBrowser.ts" />
/// <reference path="../d/node.d.ts" />
var PhantomBrowser = (function () {
    function PhantomBrowser() {
    }
    PhantomBrowser.prototype.execute = function (scriptPath) {
        var dfd = Q.defer();

        return dfd.promise;
    };

    PhantomBrowser.prototype.close = function () {
    };
    return PhantomBrowser;
})();
//# sourceMappingURL=PhantomBrowser.js.map
