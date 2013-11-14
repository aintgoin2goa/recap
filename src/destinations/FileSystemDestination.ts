/// <reference path="IDestination.ts" />
/// <reference path="IDestinationType.ts" />

import path = require("path");
import fs = require("fs");
import Q = require('q');
var DestinationType: DestinationType = require("./DestinationType");
var console: IConsole = require("../Console");

class FileSystemDestination implements IFileSystemDestination {

    public uri: string;

    public type: DestinationType;

    private dataFile: string = "data.json";

    private lockFile: string;

    private dataFilePath: string;

    private data: ITempDirRecord[];

    private dataIndex: { [file: string] : number };

    constructor(uri: string) {
        this.uri = uri;
        this.type = this.getType(uri);
        this.dataFilePath = this.uri + path.sep + this.dataFile;
        this.data = [];
        this.dataIndex = {};
        this.lockFile = this.uri + path.sep + "LOCKED";
    }

    public setup(): Q.IPromise<any> {
        if (this.isLocked()) {
            return;
        }
        var dfd = Q.defer<any>();
        // if destination does not exist, create it
        console.log("initialising destination");
        fs.mkdir(this.uri, "0666", (err) => {
            if (err) {
                if (err.code == "EEXIST") {
                    console.warn("Destination directory already exists, will attempt to merge");
                } else {
                    console.error("Failed to create destination directory", err);
                }
                
            }
            // if we have a data file already, delete the file but store contents in memory
            fs.readFile(this.dataFilePath, { encoding: "utf8" }, (err: Error, data: string) => {
                if (data) {
                    this.data = JSON.parse(data);
                    fs.unlink(this.dataFilePath, function () { });
                    this.indexData();
                }
                dfd.resolve(null);
            });
        });

        return dfd.promise;
    } 

    public getFilename(tempName: string): string {
        var name = tempName.split(path.sep).pop();
        return this.uri + path.sep + name;
    }

    public isLocked(): boolean {
        return fs.existsSync(this.uri + path.sep + "LOCKED");
    }

    public lock(): Q.IPromise<any> {
        var dfd = Q.defer<any>();
        fs.open(this.lockFile, "wx+", "0666", function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    }

    public unlock(): Q.IPromise<any>  {
        var dfd = Q.defer<any>();
        fs.unlink(this.lockFile, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
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
        var data = JSON.stringify(this.data);
        fs.writeFile(this.dataFilePath, data, { encoding: "utf8" }, function (err: Error) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(null);
            }
        });
        return dfd.promise;
    }

    private getType(uri: string): DestinationType {
        // only one type right now
        return DestinationType.FileSystem;
    }

    private indexData(): void {
        this.data.forEach( (value, index) => {
            this.dataIndex[value.filename] = index;
        });
    }
}

export = FileSystemDestination;
