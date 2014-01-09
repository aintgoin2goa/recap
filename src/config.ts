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

    public defaultOptions: IUrlOptions = {
        waitTime : 50,
        crawl : false,
        script : null
    }

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

function mergeUrlConfig(cfg: IConfig): void{
    _.each(cfg.urls, function(value, key){
        value = value || cfg.defaultOptions;
        _.defaults(value, cfg.defaultOptions);
        cfg.urls[key] = value;
    });
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
    if(!cfg.urls || _.isArray(cfg.urls) || (Object.keys(cfg.urls).length) === 0 ){
        return fail("Urls object not present or empty");
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

    if(cfg.defaultOptions){
        config.defaultOptions = cfg.defaultOptions;
    }

    config.urls = cfg.urls;
    config.widths = cfg.widths;
    config.dest = cfg.dest;
    mergeUrlConfig(config);
    loadedConfig = config;
    return config;
} 

export function getCurrentConfig(): IConfig {
    if (loadedConfig == null) {
        throw new Error("No config has been loaded yet");
    }
    return loadedConfig;
}


    
