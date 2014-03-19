var path = require("path");

function getInstallLocation() {
    return __dirname.replace(path.sep + "js", path.sep);
}


module.exports = getInstallLocation;

