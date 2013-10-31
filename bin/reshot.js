#! /usr/bin/env node
    
    var argv= require("optimist").argv;
    var args = argv._
    var main = require("../src/main");

    if(args.length){
        var config = args._[0];
        main.run(config);
    }else{
        main.generateConfig();
    }


    