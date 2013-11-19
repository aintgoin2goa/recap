var loader = require("../helpers/moduleLoader.js");
var mocks = require("../mocks/nodePhantomMock.js");
var localMocks = require("../mocks/localMocks");
var mockPage = mocks.getMockPage();
var mockPhantom = mocks.getMockPhantom(mockPage);
var mockPhantomModule = mocks.getMockPhantomModule(mockPhantom);
var mockConfig = localMocks.getMockConfig();
var Q = require("q");
var Adaptor = loader.loadModule("./src/screenshotAdaptors/PhantomAdaptor.js", { "node-phantom": mockPhantomModule, "../config" : mockConfig }).module.exports;
var Factory = loader.loadModule("./src/screenshotAdaptorFactory.js").module.exports;

var phantom, factory;


describe("PhantomAdaptor", function () {

    beforeEach(function () {
        factory = new Factory(Adaptor);
        phantom = factory.getNew();
    });

    it("Can spin up a new instance of phantomjs", function (done) {
        spyOn(mockPhantom, "createPage").andCallThrough();

        phantom.init().then(
            function () {
                expect(mockPhantom.createPage).toHaveBeenCalled();
                done();
            }
        );
    });

    it("Can set the viewport size", function (done) {
        spyOn(mockPage, "set").andCallThrough();

        phantom.init()
        .then(function () {
            return phantom.setViewPortSize(400, 200);
        }).then(
            function () {
                expect(mockPage.set.mostRecentCall.args[0]).toBe("viewportSize");
                expect(mockPage.set.mostRecentCall.args[1]).toEqual({ width: 400, height: 200 });
                done();
            }
        );
            
    });

    it("Can open a url", function (done) {
        var testUrl = "http://www.google.com";
        
        phantom.init()
        .then(function () {
            spyOn(mockPage, "open").andCallThrough();
            return phantom.open(testUrl);
        })
        .then(function () {
            expect(mockPage.open.mostRecentCall.args[0]).toBe(testUrl);
            done();
      
        });
    });



    it("Can capture the contents of the url and save it to a file", function (done) {
        var testUrl = "http://www.google.com";
        var filename = "file.png";

        spyOn(mockPage, "render").andCallThrough();

        phantom.init()
        .then(function () {
            return phantom.open(testUrl);
        })
        .then(function () {
            return phantom.capture(filename)
        })
        .then(function () {
           
            expect(mockPage.render).toHaveBeenCalled();
            expect(mockPage.render.mostRecentCall.args[0]).toBe(filename);
            done();
        });
    });

    it("Can close the phantom instance when finished with it", function (done) {
        spyOn(mockPhantom, "exit").andCallThrough();
        spyOn(mockPage, "close").andCallThrough();
        phantom.init()
        .then(function () {
            return phantom.close();
        }).
        then(function () {
            expect(mockPage.close).toHaveBeenCalled();
            expect(mockPhantom.exit).toHaveBeenCalled();
            done();
        });
    });

});