/// <reference path="IDestination.ts" />

import path = require("path");
import fs = require("fs");
import Q = require('q');
var console: IConsole = require("../Console");

class FileSystemDestination implements IFileSystemDestination {

    public uri: string;

    public dataFile: string = "data.json";

    private lockFilePath: string;

    private lockFile: string;

    private dataFilePath: string;

    private data: ITempDirRecord[];

    private dataIndex: { [file: string] : number };

    constructor(uri: string) {
        this.uri = path.resolve(uri);
        this.dataFilePath = this.uri + path.sep + this.dataFile;
        this.data = [];
        this.dataIndex = {};
        this.lockFilePath = path.resolve(this.uri + path.sep +  "LOCKED");
    }

    public setup(): Q.IPromise<any> {
        var dfd = Q.defer<any>();

        // if destination does not exist, create it
        console.log("initialising destination");
        fs.mkdir(this.uri, "0777", (err) => {
            if (err) {
                if (err.code == "EEXIST") {
                    console.warn("Destination directory already exists, will attempt to merge");
                } else {
                    console.error("Failed to create destination directory", err);
                    dfd.reject(false);
                    return;
                }
            }

            dfd.resolve(true);
        });

        return dfd.promise;
    } 

    public getFilename(tempName: string): string {
        var name = tempName.split(path.sep).pop();
        return path.resolve(this.uri + path.sep + name);
    }

    public isLocked(): boolean {
        return fs.existsSync(this.lockFilePath);
    }

    public lock(): Q.IPromise<any> {
        var dfd = Q.defer<any>();
        fs.open(this.lockFilePath, "wx+", "0777", (err, fd) => {
            if (err) {
                dfd.reject(err);
            } else {
                this.lockFile = fd;
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    }

    public unlock()  {
       fs.closeSync(this.lockFile);
       fs.unlinkSync(this.lockFilePath);
    }

    public updateData(data: ITempDirRecord[]): void {
        data.forEach( (value: ITempDirRecord) => {
            if (this.dataIndex[value.filename]) {
                this.data[this.dataIndex[value.filename]] = value;
            } else {
                this.data.push(value);
            }
        });
        this.indexData();
    }

    public writeData(): Q.IPromise<any> {
        var dfd = Q.defer<any>();
        var data = JSON.stringify(this.data, null, 2);
        fs.writeFile(this.dataFilePath, data, { encoding: "utf8" }, function (err: Error) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    }

    public readData() : Q.IPromise<any> {
        var dfd = Q.defer<any>();
        fs.readFile(this.dataFilePath, { encoding: "utf8" }, (err: Error, data: string) => {
            if (data) {
                this.data = JSON.parse(data);
                fs.unlink(this.dataFilePath, function () { });
                this.indexData();
            }
            dfd.resolve(null);
        });
        return dfd.promise;
    }

    private indexData(): void {
        this.data.forEach( (value, index) => {
            this.dataIndex[value.filename] = index;
        });
    }
}

export = FileSystemDestination;
