/// <reference path="screenshotAdaptors/IScreenshotAdaptor.ts" />

import PhantomAdaptor = require("screenshotAdaptors/PhantomAdaptor");


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