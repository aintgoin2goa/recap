/// <reference path="../d/Q.d.ts" />

interface IScreenshotAdaptor{

    init(): Qpromise;

    open(url: string): Qpromise;

    setViewPortSize(width: number, height: number): Qpromise;

    capture(filename: string): Qpromise;

    close(): void;    

}