var path = require("path");

function getInstallLocation() {
    return (__dirname.split("recap")[0] + "recap") + path.sep;
}


module.exports = getInstallLocation;

