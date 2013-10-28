#! /usr/bin/env node

function parseArgs() {
    return process.argv.filter(function (arg) {
        return (arg.indexOf("node") < 0 && arg[0] !== "-" && __filename.indexOf(arg) < 0);
    });
}

var args = parseArgs();
var config = args[0];

require("../src/main.js").run(config);