/// <reference path="ITransport.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="../d/node.d.ts" />
/// <reference path="../destinations/IFileSystemDestination.ts" />

import fs = require("fs");
import Q = require("q");
var console: IConsole = require("../Console");

class FileSystemTransport implements ITransport {

    public from: ITempDir;

    public to: IFileSystemDestination;

    private files: string[];

    private waitTime: number = 5000;

    private maxAttempts: number = 5;

    private attempts: number = 0;

    public copyFiles(dfd?: Q.Deferred<boolean>): Q.IPromise<boolean> {
       
        if (dfd === undefined) {
            dfd = Q.defer<boolean>();
        }

        this.checkForLock(dfd);
        return dfd.promise;
    }

    private checkForLock(dfd: Q.Deferred<boolean>): void {
        this.attempts++;
        if (this.to.isLocked()) {
            this.tryAgain(dfd);
        } else {
            this.start(dfd);
        }
    }   

    private tryAgain(dfd: Q.Deferred<boolean>): void {
        if (this.attempts === this.maxAttempts) {
            console.error("Destination still locked after " + this.attempts + " attempts.  Giving up...");
            setImmediate(function () {
                dfd.reject(false);
            });
        } else {
            console.warn("Destination is locked, will try again in " + (this.waitTime / 1000) + " seconds");
            setTimeout(() => {
                this.checkForLock(dfd);
            }, this.waitTime);
        }
    }

    private start(dfd: Q.Deferred<boolean>): void {
        console.log("Attempting to lock destination");
        this.to.lock().then(() => {
            console.log("Destination locked succesfully, proceeding...");
            this.files = this.from.listFiles();
            this.nextFile(dfd);
        }, (err) => {
            console.error("Failed to lock destination", err);
            process.exit(1);
            });
    }

    private nextFile(dfd: Q.Deferred<boolean>): void {
        if (this.files.length == 0) {
            console.log("All files copied, writing data.json file");
            this.to.writeData()
            .then(
                () => {
                    console.log("unlock destination directory");
                    return this.to.unlock();
                }
            )
            .then(function () {
                dfd.resolve(true);
            });
            return;
        }

        var file = this.files.shift();
        this.copyFile(file)
            .then(
            () => {
                this.nextFile(dfd);
            },
            () => {
                dfd.reject(false);
        });
    }

    private copyFile(file: string): Q.IPromise<boolean> {
        var dfd: Q.Deferred<boolean> = Q.defer();
        if(file.indexOf(this.to.dataFile) != -1){
            this.readData(file);
            setImmediate(function(){
                dfd.resolve(true);
            });
            return dfd.promise;
        }


        var source = fs.createReadStream(file);
        var destination = fs.createWriteStream(this.to.getFilename(file));
        console.log("Copy " + file + " to " + this.to.getFilename(file));
        source.on("error", function (err) {
            console.error(err);
            dfd.reject(false);
        });

        destination.on("error", function (err) {
            console.error(err);
            dfd.reject(false);
        });

        destination.on("finish", function () {
            console.log("Finished piping " + file);
            dfd.resolve(true);
        });

        source.pipe(destination);

        return dfd.promise;
    }

    private readData(file: string): void{
        var dataStr: string = fs.readFileSync(file, {encoding:"utf8"});
        // if undefined, null or empty may as well not bother
        if(!dataStr){
            return;
        }

        var data: ITempDirRecord[] = JSON.parse(dataStr);
        this.to.updateData(data);
    }
}

export = FileSystemTransport;