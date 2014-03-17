/// <reference path="d/node.d.ts" />

import path = require("path");

function getInstallLocation(): string{
	return (__dirname.split("recap")[0] + "recap") + path.sep;
}

export = getInstallLocation;