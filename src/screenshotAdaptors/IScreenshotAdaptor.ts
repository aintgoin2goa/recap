/// <reference path="../d/Q.d.ts" />

interface IScreenshotAdaptor{

    init(): Q.IPromise<any>;

    open(url: string): Q.IPromise<any>;

    setViewPortSize(width: number, height: number): Q.IPromise<any>;

    capture(filename: string): Q.IPromise<any>;

    close(): Q.IPromise<any>;    

}