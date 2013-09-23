var expect = require("chai").expect;
var loader = require("./helpers/moduleLoader.js");
var mocks = require("./mocks/nodePhantomMock.js");
var Adaptor = loader.loadModule("./src/screenshotAdaptors/PhantomAdaptor.js", { "node-phantom": mocks.MockPhantomModule }).module.exports;
var Factory = loader.loadModule("./src/screenshotAdaptorFactory.js").module.exports;
var Q = require("q");
var phantom, factory;


describe("PhantomAdaptor", function () {

    beforeEach(function () {
        factory = new Factory(Adaptor);
        phantom = factory.getNew();
    });

    it("Can spin up a new instance of phantomjs", function (done) {
        phantom.init().then(
            function () {
                completed = true;
                done();
            },
            function () {
                completed = false;
                done();
            }
        );
        expect(mocks.MockPhantomModule.create).to.have.been.called;
        expect(mocks.MockPhantom.createPage).to.have.been.called;
    });

    it("Can set the viewport size", function (done) {
        phantom.init()
        .then(function () {
            return phantom.setViewPortSize(400, 200);
        }).then(
            function () {
                done();
            },
            function () {
                done();
            }
        );
        expect(mocks.MockPage.set).to.have.been.called;
    });

    it.skip("Can open a url", function () {

    });

    it.skip("Can capture the contents of the url and save it to a file", function () {

    });

    it.skip("Can close the phantom instance when finished with it", function () {


    });

});