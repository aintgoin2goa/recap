/// <reference path="ITransport.ts" />
/// <reference path="../d/Q.d.ts" />
/// <reference path="../d/node.d.ts" />

import fs = require("fs");
import Q = require("q");

class FileSystemTransport implements ITransport {

    public from: ITempDir;

    public to: IDestDir;

    private files: string[];

    copyFiles(): Q.IPromise<boolean> {
        var dfd: Q.Deferred<boolean> = Q.defer();
        this.files = this.from.listFiles();
        this.nextFile(dfd);
        return dfd.promise;
    }

    private nextFile(dfd: Q.Deferred<boolean>): void {
        if (this.files.length == 0) {
            dfd.resolve(true);
            return;
        }
        var file = this.files.shift();
        this.copyFile(file)
        .then(
        () => {
            fs.unlink(file, (err) => {
                if (err) {
                    console.error(err);
                    dfd.reject(false);
                } else {
                    this.nextFile(dfd);
                }
            });
        },
        () => {

                dfd.reject(false);
            }
        );
    }

    private copyFile(file: string): Q.IPromise<boolean> {
        var dfd: Q.Deferred<boolean> = Q.defer();
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
}

export = FileSystemTransport;