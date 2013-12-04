/// <reference path="../d/Q.d.ts" />

interface IScreenshotAdaptor{

    init(): Q.IPromise<any>;

    open(): Q.IPromise<any>;

    navigate(url: string, waitTime?: number): Q.IPromise<any>

    setViewPortSize(width: number, height: number): Q.IPromise<any>;

    capture(filename: string): Q.IPromise<any>;

    crawl(): Q.IPromise<any>;

    close(): Q.IPromise<any>;

    exit(): Q.IPromise<any>;    

}