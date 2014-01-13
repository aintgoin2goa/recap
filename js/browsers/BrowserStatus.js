var BrowserStatus;
(function (BrowserStatus) {
    BrowserStatus[BrowserStatus["READY"] = 0] = "READY";
    BrowserStatus[BrowserStatus["ACTIVE"] = 1] = "ACTIVE";
    BrowserStatus[BrowserStatus["COMPLETE"] = 2] = "COMPLETE";
    BrowserStatus[BrowserStatus["ERROR"] = 3] = "ERROR";
})(BrowserStatus || (BrowserStatus = {}));


module.exports = BrowserStatus;

