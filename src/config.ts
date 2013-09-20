/// <reference path="d/node.d.ts" />
/// <reference path="IConfig.ts" />

import fs = require("fs");
import path = require("path");


    export class Config implements IConfig{
        
        public urls: string[];

        public widths: number[];

        public dest: string = "../dest/";

        public tempFolder: string = "../temp/";

    }

    function loadFromFilePath(pth: string): Object
    {
        pth = path.normalize(pth);
        var file = fs.readFileSync(pth, { encoding: "utf8" });
        return JSON.parse(file);
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
        if (cfg.tempFolder) {
            config.tempFolder = cfg.tempFolder;
        }
        return config;
    } 


    
