var BrowserStatus;
(function (BrowserStatus) {
    BrowserStatus[BrowserStatus["IDLE"] = 0] = "IDLE";
    BrowserStatus[BrowserStatus["ACTIVE"] = 1] = "ACTIVE";
    BrowserStatus[BrowserStatus["COMPLETE"] = 2] = "COMPLETE";
    BrowserStatus[BrowserStatus["ERROR"] = 3] = "ERROR";
})(BrowserStatus || (BrowserStatus = {}));


module.exports = BrowserStatus;

