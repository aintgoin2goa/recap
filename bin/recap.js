#!/usr/local/bin/node

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
    
var console = require("../src/Console");
console.setConfig("verbose", argv.V);

var args = argv._;
    
var main = require("../src/main");


if(args.length){
    var config = args[0];
    main.run(config);
}else{
    main.generateConfig();
}