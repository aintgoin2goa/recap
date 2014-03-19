/// <reference path="d/node.d.ts" />

import path = require("path");

function getInstallLocation(): string{
	return __dirname.replace(path.sep + "js", path.sep);
}

export = getInstallLocation;