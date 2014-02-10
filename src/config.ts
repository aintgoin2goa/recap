/// <reference path="d/node.d.ts" />
/// <reference path="IConfig.ts" />
/// <reference path="d/underscore.d.ts" />

import fs = require("fs");
import path = require("path");
import _ = require("underscore");

var loadedConfig: IConfig;

export class Config implements IConfig{
        
    public  urls: {[url: string]: IUrlOptions};

    public widths: number[];

    public dest: string = "../dest/";

    public options: IUrlOptions = {
        waitTime : 50,
        crawl : false,
        script : null
    };

    public settings : IConfigSettings = {
        maxInstances : 4,
        template : "default"
    };
}

function loadFromFilePath(pth: string): Object
{
    pth = path.normalize(pth);
    var file = fs.readFileSync(pth, { encoding: "utf8" });
    var contents;
    try {
        return JSON.parse(file);
    } catch (e) {
        console.error("JSON Parse Error", e);
        setTimeout(function () {
            process.exit(1);
        }, 10);
            
    }       
}


function mergeUrlConfig(config: IConfig, options: IUrlOptions): void {
    for(var option in config.options){
        if(options[option]){
            config.options[option] = options[option];
        }
    }

    for(var url in config.urls){
        config.urls[url] = _.clone(config.options);
        if(options[url]){
            _.extend(config.urls[url], options[url]);
        }
    }
}

export function validate(cfg: string): IConfigValidationResult
export function validate(cfg: Object): IConfigValidationResult
export function validate(cfg: any): IConfigValidationResult
{
    if (typeof (cfg) == "string") {
        return validate(loadFromFilePath(cfg));
    }

    cfg = <IConfig>cfg;

    var result : IConfigValidationResult = {
        result: true,
        message: ""
    };

    var fail = function(msg){
        result.result = false;
        result.message = msg;
        return result;
    }

    if(!cfg.widths || !cfg.widths.push ){
        return fail("Config file must have an array of widths");
    }

    if(!cfg.dest || typeof(cfg.dest) !== "string"){  
        return fail("No valid destination given")
    }
    
    if(!cfg.urls || !cfg.urls.push ){
        return fail("Config must have an array of urls");
    }

    return result;
}
    
export function load(cfg: string): IConfig
export function load(cfg: Object): IConfig
export function load(cfg: any): IConfig
{
    if (typeof (cfg) == "string") {
        return load(loadFromFilePath(cfg));
    }

    var validation = validate(cfg);
    if(!validation.result){
        throw new Error(validation.message);
    }

    var config = new Config();

    if(cfg.settings){
        config.settings = cfg.settings;
    }

    config.widths = cfg.widths;
    config.dest = cfg.dest;
    config.urls = Object.create(null);
    cfg.urls.forEach(function(url){
        config.urls[url] = Object.create(null);
    });
    mergeUrlConfig(config, (cfg.options || Object.create(null) ));

    loadedConfig = config;
    return config;
} 

export function getCurrentConfig(): IConfig {
    if (loadedConfig == null) {
        throw new Error("No config has been loaded yet");
    }
    return loadedConfig;
}


    
