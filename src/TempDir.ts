/// <reference path="ITempDir.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path = "d/Q.d.ts" />

import fs = require("fs");
import path = require("path");
import Q = require('q');
var rimraf = require("rimraf");

class TempDir implements ITempDir {

    public dir: string;

    private records: ITempDirRecord[];

    private dirBase = "temp";

    private extension = ".jpg";

    constructor()
    {
        this.dir = this.createTempDir();
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

    private createTempDir(): string {
        var i = 1;
        var filename = this.dirBase + i.toString();
        while(fs.existsSync(filename) ){
            i++;
            filename = this.dirBase + i.toString();
        } 
        fs.mkdirSync(filename);
        return filename;
    }
}

export = TempDir;