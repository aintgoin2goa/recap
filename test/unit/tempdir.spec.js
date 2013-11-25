var loader = require("../helpers/moduleLoader.js");
var mocks = require("../mocks/nodeMocks.js");
var fsMock = mocks.getFSMock();
var rimrafMock = require("../mocks/rimrafMock.js");
var tmpMock = require("../mocks/tmpMock.js").getTmpMock();
var path = require("path");
var TempDir = loader.loadModule("./js/TempDir.js", { "fs": fsMock, "rimraf" : rimrafMock, "tmp" : tmpMock }).module.exports;

var url = "http://www.google.com";

describe("TempDir", function () {

	

	it("Will create a new directory using the tmp module when initialised", function (done) {
		new TempDir().ready.then(function(){
			expect(tmpMock.dir).toHaveBeenCalled();
			done();
		}, function(){ done(false); });
	});


	it("Can add a new record and return the filename", function (done) {
		fsMock.reset();
		var tempDir = new TempDir();
		tempDir.ready.then(function(){
			var filename = tempDir.createRecord(url, 600);
			expect(filename).toBe(tempDir.dir + path.sep + "www.google.com_600.jpg");
			done();
		}, function(){ done(false); });
	});

	it("Can save records to a json file in the directory", function (done) {
		spyOn(fsMock, "writeFile");
		var tempDir = new TempDir();
		
		tempDir.ready.then(function(){
			var filename = tempDir.createRecord(url, 600).replace(tempDir.dir + path.sep, "");
			tempDir.saveRecords();

			expect(fsMock.writeFile).toHaveBeenCalled();
			var arg = JSON.parse(fsMock.writeFile.mostRecentCall.args[1])[0];

			expect(arg.filename).toBe(filename);
			expect(arg.width).toBe(600);
			expect(arg.url).toBe(url);
			done();
		}, function(){ done(false); });
		
	});

	it("Can delete the temp directory and all it's children", function (done) {
		var tempDir = new TempDir();
		tempDir.ready.then(function(){
			return tempDir.remove();
		})
		.then(function () {
			expect(rimrafMock).toHaveBeenCalled();
			done();
		});
	});


	it("Will return an array of files", function (done) {
		var files = ["file1.jpg", "file2.jpg", "file3.jpg"];
       
		fsMock.setDirFiles(files);
		var tempDir = new TempDir();
		tempDir.ready.then(function(){
			var expected = files.map(function (file) { return tempDir.dir + path.sep + file; });
			var result = tempDir.listFiles();
			expect(result).toEqual(expected);
			done();
		});
	});
});
