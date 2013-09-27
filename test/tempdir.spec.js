var loader = require("./helpers/moduleLoader.js");
var mocks = require("./mocks/nodeMocks.js");
var fsMock = mocks.getFSMock();
var path = require("path");
var TempDir = loader.loadModule("./src/TempDir.js", { "fs": fsMock }).module.exports;

var url = "http://www.google.com"

describe("TempDir", function () {

	

	it("Will create a new directory when initialised", function () {
		spyOn(fsMock, "mkdirSync").andCallThrough();

		new TempDir();

		expect(fsMock.mkdirSync).toHaveBeenCalledWith("temp1");
	});

	it("Will always create a directory with a unique name", function () {
		spyOn(fsMock, "mkdirSync").andCallThrough();
		fsMock.addExisting("temp1");

		new TempDir();

		expect(fsMock.mkdirSync).toHaveBeenCalledWith("temp2");
	});

	it("Can add a new record and return the filename", function () {
		fsMock.reset();

		var tempDir = new TempDir();

		var filename = tempDir.createRecord(url, 600);

		expect(filename).toBe("temp1" + path.sep + "www.google.com_600.jpg");

	});

	it("Can save records to a json file in the directory", function () {
		spyOn(fsMock, "writeFile");
		var tempDir = new TempDir();
		var filename = tempDir.createRecord(url, 600);

		tempDir.saveRecords();

		expect(fsMock.writeFile).toHaveBeenCalled();

		var arg = JSON.parse(fsMock.writeFile.mostRecentCall.args[0])[0];

		expect(arg.filename).toBe(filename);
		expect(arg.width).toBe(600);
		expect(arg.url).toBe(url);
	});

	it("Can delete the temp directory if it is empty", function (done) {
		spyOn(fsMock, "rmdir").andCallThrough();
		var tempDir = new TempDir();
		tempDir.remove()
		.then(function () {
			expect(fsMock.rmdir).toHaveBeenCalled();
			done();
		});
	});

	it("Will not delete the temp directory if it is not empty", function () {
		spyOn(fsMock, "rmdir").andCallThrough();
		fsMock.setFileCount(1);

		var tempDir = new TempDir();
		tempDir.remove()
		.then(function () {
			expect(fsMock.rmdir).not.toHaveBeenCalled();
			done();
		});
	});

});
