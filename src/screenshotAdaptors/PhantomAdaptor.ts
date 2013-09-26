/// <reference path="../d/node.d.ts" />
/// <reference path="../d/node-phantom.d.ts" />
/// <reference path="../d/Q.d.ts" />

/// <reference path="IScreenshotAdaptor.ts" />

import nodePhantom = require("node-phantom");
var Q = require("Q");

class PhantomAdaptor implements IScreenshotAdaptor{

    private page: NP_Page;

    private phantom: NP_Phantom;

    public init(): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        nodePhantom.create((err, phantom) => {
            if (err) {
                dfd.reject(err);
                return;
            }
            this.phantom = phantom;
            this.OnCreate(phantom, dfd);
        });
        return dfd.promise;
    }

    public setViewPortSize(width: number, height: number): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        console.log("setViewPortSize");
        this.page.set("viewportSize", { width: width, height: height }, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    }

    public open(url: string): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.page.open(url, (err, status) => {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(status);
            }
        });
        return dfd.promise;
    }

    public capture(filename: string): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.page.render(filename, (err) => {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    }

    public close(): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.page.close(() => {
            this.phantom.exit(() => {
                console.log("Phantom exited");
                dfd.resolve(true);
            });
        });
        return dfd.promise;
    }

    private OnCreate(phantom: NP_Phantom, dfd: Q.Deferred<any>): void
    {
        console.log("Created instance of phantom");
        phantom.createPage( (err, page) => {
            if (err) {
                dfd.reject(err);
                return;
            }
            this.OnPageCreate(page, dfd);
        });
        phantom.on("exit", () => {
            this.OnExit();
        });
    }

    private OnPageCreate(page: NP_Page, dfd: Q.Deferred<any>): void
    {
        this.page = page;
        console.log("page created");
        dfd.resolve(true);
    }

    private OnExit(): void
    {
        console.log("Phantom exited");
    }

    private OnPageClose(): void
    {

    }

}

export = PhantomAdaptor;