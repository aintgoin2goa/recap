﻿var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var localMocks = require("../mocks/localMocks.js");

var fsMock;
var streamMock;
var TempDirMock = localMocks.getTempDirMock();
var DestDirMock = localMocks.getDestDirMock();

var Transport;

var transport;

describe("FileSystemTransport", function () {
    
    jasmine.getEnv().defaultTimeoutInterval = 11000;

    beforeEach(function () {
        streamMock = nodeMocks.getMockStream();
        streamMock.pipe = function() {
            setTimeout(function() {
                streamMock.fire("finish");
            }, 500);
        };
        fsMock = nodeMocks.getFSMock();
        spyOn(fsMock, "createWriteStream").andCallThrough();
        spyOn(fsMock, "createReadStream").andCallThrough();
        fsMock.setMockstream(streamMock);
        Transport = loader.loadModule("./js/transports/FileSystemTransport.js", { "fs": fsMock }).module.exports;
        transport = new Transport();
        transport.from = TempDirMock;
        transport.to = DestDirMock;
        DestDirMock.isLocked.reset();
        DestDirMock.reset();
    });

    it("Can save a file stored in the temp directory to another place on the same filesystem", function (done) {
    
       var from = "file.jpg", to = "file2.jpg";
        TempDirMock.listFiles = function() {
            return [from];
        };
        DestDirMock.setFilename(to);
        transport.copyFiles()

        .then(
            function () {
                expect(fsMock.createReadStream).toHaveBeenCalledWith(from);
                expect(fsMock.createWriteStream).toHaveBeenCalledWith(to);
                done();
            }
        );

    });

   it("Will check if the destination directory is locked before using it", function(done) {
        var from = "file.jpg";
        TempDirMock.listFiles = function () {
            return [from];
        };
        transport.copyFiles()
            .then(function () {
                try {
                    expect(DestDirMock.lastInvocationOf("isLocked")).toBeLessThan(DestDirMock.firstInvocationOf("getFilename"));
                } catch(e) {
                    console.log(e);
                }
               
                done();
            });
    });

    it("Will try again later if the directory is locked", function (done) {
        
        var from = "file.jpg";
        TempDirMock.listFiles = function () {
            return [from];
        };
        DestDirMock.setIsLocked(true, 1);
        
        transport.copyFiles()
        
            .then(function () {
                expect(DestDirMock.isLocked.callCount).toBe(2);
                done();
            });
    });

  it("Will lock the destination directory before copying", function(done) {
        var from = "file.jpg", to = "file2.jpg";
        TempDirMock.listFiles = function () {
            return [from];
        };
        DestDirMock.setIsLocked(false, 0);
        transport.copyFiles()

        .then(
            function () {
                expect(DestDirMock.lock).toHaveBeenCalled();
                done();
            }
        );
    });

    it("Will unlock the destination after it's finished", function(done) {
        var from = "file.jpg", to = "file2.jpg";
        TempDirMock.listFiles = function () {
            return [from];
        };

        transport.copyFiles()

        .then(
            function () {
                expect(DestDirMock.unlock).toHaveBeenCalled();
                done();
            }
        );
    });

   it("Will loop through all files in the directory, moving one after the other", function (done) {
        var files = ["file1.jpg", "file2.jpg", "file3.jpg"];
        var length = files.length;
        var filesCopy = files.slice(0);
        TempDirMock.listFiles = function() {
            return files;
        };
        DestDirMock.getFilename = function(filename) {
            return filename;
        };
       
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

   it("Will not copy the data.json file", function(done){
        debugger;
        var files = ["file1.jpg", "file2.jpg", "file3.jpg", "data.json"];
        var length = files.length;
        var filesCopy = files.slice(0);
        TempDirMock.listFiles = function() {
            return files;
        };
        DestDirMock.getFilename = function(filename) {
            return filename;
        };

        transport.copyFiles()

        .then(
            function () {
                expect(fsMock.createReadStream).not.toHaveBeenCalledWith("data.json");
                done();
            },
            function(){
                done(false);
            }
        );
    });

   it("Will read in data from the data.json and pass it to the destination to be merged with existing data", function(done){
          var files = ["file1.jpg", "file2.jpg", "file3.jpg", "data.json"];
          var data = ["some data"];
        var length = files.length;
        var filesCopy = files.slice(0);
        TempDirMock.listFiles = function() {
            return files;
        };
        DestDirMock.getFilename = function(filename) {
            return filename;
        };
        fsMock.setReadFileData(JSON.stringify(data));
     
        transport.copyFiles()

        .then(
            function () {
                expect(DestDirMock.updateData).toHaveBeenCalledWith(data);
                done();
            },
            function(){
                done(false);
            }
        );
    });


});