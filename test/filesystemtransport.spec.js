var loader = require("./helpers/moduleLoader.js");
var nodeMocks = require("./mocks/nodeMocks.js");
var localMocks = require("./mocks/localMocks.js");

var fsMock;
var streamMock;
var TempDirMock = localMocks.getTempDirMock();
var DestDirMock = localMocks.getDestDirMock();

var Transport;

var transport;

describe("FileSystemTransport", function () {

    beforeEach(function () {
        streamMock = nodeMocks.getMockStream();
        streamMock.pipe = function () {
            setTimeout(function () {
                streamMock.fire("finish");
            }, 500);
        }
        fsMock = nodeMocks.getFSMock();
        spyOn(fsMock, "createWriteStream").andCallThrough();
        spyOn(fsMock, "createReadStream").andCallThrough();
        fsMock.setMockstream(streamMock);
        Transport = loader.loadModule("./src/transports/FileSystemTransport.js", { "fs": fsMock }).module.exports;
        transport = new Transport();
        transport.from = TempDirMock;
        transport.to = DestDirMock;
    });

    it("Can save a file stored in the temp directory to another place on the same filesystem", function (done) {
    
        debugger
       var from = "file.jpg", to = "file2.jpg";
        TempDirMock.listFiles = function () {
            return [from];
        }
        DestDirMock.getFilename = function(){
            return to;
        }
       
        transport.copyFiles()

        .then(
            function () {
                debugger;
                expect(fsMock.createReadStream).toHaveBeenCalledWith(from);
                expect(fsMock.createWriteStream).toHaveBeenCalledWith(to);
                done();
            }
        );

    });

    it("Will loop through all files in the directory, moving one after the other", function (done) {
        var files = ["file1.jpg", "file2.jpg", "file3.jpg"];
        var length = files.length;
        var filesCopy = files.slice(0);
        TempDirMock.listFiles = function () {
            return files;
        }
        DestDirMock.getFilename = function (filename) {
            return filename;
        }
       
        transport.copyFiles()

        .then(
            function () {
                expect(fsMock.createWriteStream).toHaveBeenCalled();
                expect(fsMock.createReadStream).toHaveBeenCalled();

                for (var i = 0; i < length; i++) {
                    expect(fsMock.createWriteStream.argsForCall[i][0]).toBe(filesCopy[i]);
                    expect(fsMock.createReadStream.argsForCall[i][0]).toBe(filesCopy[i]);
                }
                done();
            }
        );
    });

    it("Will delete a file after it has been copied", function (done) {
        
        var from = "file.jpg", to = "file2.jpg";
        TempDirMock.listFiles = function () {
            return [from];
        }
        DestDirMock.getFilename = function () {
            return to;
        }
        spyOn(fsMock, "unlink").andCallThrough();

        transport.copyFiles()

        .then(
            function () {
                expect(fsMock.unlink).toHaveBeenCalled();
                expect(fsMock.unlink.mostRecentCall.args[0]).toBe(from);
                done();
            }
        );
    });

});