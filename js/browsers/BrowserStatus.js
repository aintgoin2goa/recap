var BrowserStatus = (function () {
    function BrowserStatus() {
    }
    BrowserStatus.IDLE = 0;

    BrowserStatus.ACTIVE = 1;

    BrowserStatus.ERROR = 2;
    return BrowserStatus;
})();


module.exports = BrowserStatus;

