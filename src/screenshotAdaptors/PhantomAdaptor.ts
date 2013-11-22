/// <reference path="../d/node.d.ts" />
/// <reference path="../d/node-phantom.d.ts" />
/// <reference path="../d/Q.d.ts" />

/// <reference path="IScreenshotAdaptor.ts" />

import nodePhantom = require("node-phantom");
var console: IConsole = require("../Console");
var Q = require("q");
import configModule = require("../Config");
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
            dfd.resolve(true);
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

    public open(): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.phantom.createPage( (err, page) => {
            if (err) {
                dfd.reject(err);
                return;
            }
            this.page = page;
            dfd.resolve(true);
        });
        return dfd.promise;
    }

    public navigate(url: string): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.page.open(url, (err, status) =>{
            if(err){
                dfd.reject(err);
                return
            }

            this.delayedResolve(dfd);
        });

        return dfd.promise;
    }

    public crawl(): Q.IPromise<any>
    {
        console.log("start crawl")
        var dfd: Q.Deferred<any> = Q.defer();
        var crawlFunc = function(){
            var urls = [];
            var links = document.getElementsByTagName('a');
            for(var i=0, l=links.length; i<l; i++){
                if(links[i].href.indexOf(location.hostname) != -1){
                    urls.push(links[i].href.replace(/#.*$/, ''));
                }
            }
            return urls;
        }
        this.page.evaluate(crawlFunc, function(err, urls){
            console.log("urls found", urls);
            if(err){
                console.log(err);
                dfd.reject(err);
            }else{
                dfd.resolve(urls);
            }
        });
        return dfd.promise;
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
            console.log("Page closed");
            dfd.resolve(true);
        });
        return dfd.promise;
    }

    public exit(): Q.IPromise<any>
    {
        var dfd: Q.Deferred<any> = Q.defer();
        this.phantom.exit(() => {
            dfd.resolve(true);
        });
        return dfd.promise;
    }

    private delayedResolve(dfd: Q.Deferred<any>): void 
    {

        setTimeout(function () {
            dfd.resolve(true);
        }, this.delay);
    }
}

export = PhantomAdaptor;