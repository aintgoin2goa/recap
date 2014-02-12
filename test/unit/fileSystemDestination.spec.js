var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");

var path = require("path");

var fakeConsole = process.argv.indexOf("npm") > -1 ? console : {
    log: function() {
    }
};

describe("FileSystemDestination", function () {
    
    var fsMock;
    var Destination;
    var destination;

    var uri = "./dest/";

    beforeEach(function () {
        fsMock = nodeMocks.getFSMock();
        spyOn(fsMock, "mkdir").andCallThrough();
        spyOn(fsMock, "writeFile").andCallThrough();
        spyOn(fsMock, "unlink").andCallThrough();
        spyOn(fsMock, "open").andCallThrough();
        Destination = loader.loadModule("./js/destinations/FileSystemDestination.js", { "fs": fsMock, "console" : fakeConsole }).module.exports;
        destination = new Destination(uri);
    });

    it("Will create the directory on initialisation", function(done) {
        destination.setup().then(function() {
            expect(fsMock.mkdir.mostRecentCall.args[0]).toBe(path.resolve(uri));
            done();
        });
       
    });

    it("Will save any existing data to memory and delete the data.json file", function(done) {
        var data = [{ filename: "file", width: 300, date: new Date(), url: "http:google.com" }];
        fsMock.setReadFileData(JSON.stringify(data, null, 2));
       
        destination.setup()
            .then(function(){
                return destination.readData();
            })
            .then(function () {
                return destination.writeData();
            })
        
            .then(function () {
                expect(fsMock.writeFile.mostRecentCall.args[1]).toBe(JSON.stringify(data, null, 2));
                expect(fsMock.unlink.mostRecentCall.args[0]).toBe(path.resolve(uri + path.sep + "data.json"));
                done();
            });

    });

    it("Can add a file called 'LOCKED' to the directory", function(done) {

        destination.setup()
            .then(function() {
                return destination.lock();
            })
            .then(function () {
                expect(fsMock.open.mostRecentCall.args[0]).toBe(path.resolve(uri + "LOCKED"));
                expect(fsMock.open.mostRecentCall.args[1]).toBe("wx+");
                done();
            });

    });

    it("Can check if the directory is locked", function (done) {
        
        destination.setup()
           .then(function () {
               return destination.lock();
           })
           .then(function () {
               expect(destination.isLocked()).toBe(true);
               done();
           });
    });


    it("Can update the data held in memory", function (done) {
        var data = [{ filename: "file", width: 300, date: new Date(), url: "http:google.com" }];
        var dataStr = JSON.stringify(data, null, 2);
        
        destination.updateData(data);
        destination.writeData()
        
            .then(function() {
                expect(fsMock.writeFile.mostRecentCall.args[1]).toBe(dataStr);
                done();
            });
    });
});