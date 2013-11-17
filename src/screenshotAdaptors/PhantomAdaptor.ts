/// <reference path="../d/node.d.ts" />
/// <reference path="../d/node-phantom.d.ts" />
/// <reference path="../d/Q.d.ts" />

/// <reference path="IScreenshotAdaptor.ts" />

import nodePhantom = require("node-phantom");
var console: IConsole = require("../Console");
var Q = require("q");
import configModule = require("../config");
var config: IConfig;

class PhantomAdaptor implements IScreenshotAdaptor{

    private page: NP_Page;

    private phantom: NP_Phantom;

    private delay: number;


    public init(): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        config = configModule.getCurrentConfig();
        this.delay = config.options.waitTime;
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
        this.page.set("viewportSize", { width: width, height: height }, function (err) {
            if (err) {
                console.error("ERROR", err);
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
                this.delayedResolve(dfd);
            }
        });
        return dfd.promise;
    }

    private delayedResolve(dfd: Q.Deferred<any>): void {

        setTimeout(function () {
            dfd.resolve(true);
        }, this.delay);
    }

    public capture(filename: string): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.page.render(filename, (err) => {
            if (err) {
                console.error("ERROR", err);
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