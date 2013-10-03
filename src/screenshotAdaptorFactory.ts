/// <reference path="screenshotAdaptors/IScreenshotAdaptor.ts" />

class ScreenshotAdaptorFactory<T>{

    private Adaptor;

    constructor(adtp) {
        this.Adaptor = adtp;
    }

    public getNew(): T
    {
        return new this.Adaptor();
    }
}

export = ScreenshotAdaptorFactory;