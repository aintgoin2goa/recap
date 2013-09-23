/// <reference path="../d/node.d.ts" />
/// <reference path="../d/node-phantom.d.ts" />
/// <reference path="../d/Q.d.ts" />

/// <reference path="IScreenshotAdaptor.ts" />

import nodePhantom = require("node-phantom");
var Q = require("Q");

class PhantomAdaptor implements IScreenshotAdaptor{

    private page: NP_Page;

    public init(): Qpromise
    {
        var dfd: Qdeferred = Q.defer();
        nodePhantom.create((err, phantom) => {
            if (err) {
                dfd.reject(err);
                return;
            }
            this.OnCreate(phantom, dfd);
        });
        return dfd.promise;
    }

    public setViewPortSize(width: number, height: number): Qpromise
    {
        var dfd: Qdeferred = Q.defer();
        this.page.set("viewportSize", { width: width, height: height }, function (err) {
            if (err) {
                dfd.reject(err);
            } else {
                dfd.resolve(true);
            }
        });
        return dfd.promise;
    }

    public open(url: string): Qpromise
    {
        var dfd = Q.defer();

        return dfd.promise;
    }

    public capture(filename: string): Qpromise
    {
        var dfd = Q.defer();

        return dfd.promise;
    }

    public close(): void
    {
    
    }

    private OnCreate(phantom: NP_Phantom, dfd: Qdeferred): void
    {
        console.log("Created instance of phantom");
        phantom.createPage((err, page) => {
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

    private OnPageCreate(page: NP_Page, dfd:Qdeferred): void
    {
        this.page = page;
        console.log("page created");
        dfd.resolve(true);
    }

    private OnExit(): void
    {
        console.log("Phantom exited");
    }

}

export = PhantomAdaptor;