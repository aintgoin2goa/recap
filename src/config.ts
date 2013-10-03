/// <reference path="d/node.d.ts" />
/// <reference path="IConfig.ts" />

import fs = require("fs");
import path = require("path");


    export class Config implements IConfig{
        
        public urls: string[];

        public widths: number[];

        public dest: string = "../dest/";

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
    
    export function load(cfg: string): IConfig
    export function load(cfg: Object): IConfig
    export function load(cfg: any): IConfig
    {
        if (typeof (cfg) == "string") {
            return load(loadFromFilePath(cfg));
        }
        var config = new Config;
        config.urls = cfg.urls;
        config.widths = cfg.widths;
        if (cfg.dest) {
            config.dest = cfg.dest;
        }
        return config;
    } 


    
