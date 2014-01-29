#!/usr/bin/env node

var argv = require("optimist")
    .options('v', {
    alias : "version",
    default : false
})
    .options('V', {
    alias : "verbose",
    default : false
})
.argv;
    
var pkg = require("../package.json");
if(argv.v){
    process.stdout.write(pkg.version);
    process.stdout.write("\n");
    process.exit(0);
}

    
var console = require("../js/Console");
console.setConfig("verbose", argv.V);
console.setConfig("enabled", true);

var args = argv._;
    
var main = require("../js/main");

switch(args[0]){
    case "demo" :
        main.generateConfig();
        break;
    case "clean" : 
        main.clean();
        break;
    default : 
        main.run(args[0], true);
        break;
}


