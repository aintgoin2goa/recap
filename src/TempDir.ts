/// <reference path="ITempDir.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/Q.d.ts" />
/// <reference path="d/tmp.d.ts" />

import fs = require("fs");
import path = require("path");
import Q = require('q');
import tmp = require('tmp');
var rimraf = require("rimraf");

class TempDir implements ITempDir {

    public dir: string;

    public ready: Q.IPromise<any>;

    private records: ITempDirRecord[];

    private dirBase = "temp";

    private extension = ".jpg";

    constructor()
    {
        this.ready = this.createTempDir();
        this.records = []; 
    }

    public createRecord(url: string, width: number): string {
        var filename = url.replace(/(http|https):\/\//, '').replace(/\//g, '_');
        filename = filename + "_" + width.toString() + this.extension;
        var record: ITempDirRecord = {
            filename: filename,
            url: url,
            width: width,
            date : new Date()
        }
        this.records.push(record);
        return this.dir + path.sep + filename;
    }

    public saveRecords(): void {
        var data = JSON.stringify(this.records, null, 2);
        fs.writeFile(this.dir + path.sep + "data.json", data, { encoding: 'utf8' });
    }

    public remove(): Q.IPromise<any> {
        var dfd: Q.Deferred<any> = Q.defer();
        rimraf(this.dir, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    }

    public listFiles(): string[] {
        return fs.readdirSync(this.dir).map( (file) => {
            return this.dir + path.sep + file;
        });
    }

    private createTempDir(): Q.IPromise<any> {
       var dfd = Q.defer<any>();
       tmp.dir((err, path) =>{
            if(err){
                console.error("Failed to create temporary directory", err);
                process.exit(1);
                return;
            }
            
            this.dir = path;
            dfd.resolve(true);
           
        });
       return dfd.promise;
    }
}

export = TempDir;