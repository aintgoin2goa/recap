var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var localMocks = require("../mocks/localMocks.js");

var fsMock = nodeMocks.getFSMock();
var BrowserSwarmMock = localMocks.getBrowserSwarmMockConstructor();

var main = loader.loadModule("./js/main.js", {"fs" : fsMock, "./browsers/BrowserSwarm" : BrowserSwarmMock}).module.exports;

var fs = require("fs");
var path = require("path");

var config = require("../data/config.json");

describe("main", function(){

	beforeEach(function(){

	});	

	it("can be called with a config object and will return a promise", function(){
		var promise = main.run(config);
		
		expect(promise).not.toBeNull();
	});

	it("Will load the config object from json if given a filepath", function(){
		var p = path.resolve("./test/data/config.json");
		fsMock.setReadFileData(JSON.stringify(config));

		main.run(p);

		expect(fsMock.readFileSync).toHaveBeenCalledWith(p, jasmine.any(Object));
	});

	it("Will instantiate a new BrowserSwarm with the number of instances given in config file", function(){
		debugger;
		main.run(config);

		expect(BrowserSwarmMock).toHaveBeenCalledWith(config.settings.maxInstances);
	});

	xit("Will create a temporary directory");

	xit("Will instantiate a new TaskQueue");

	xit("Will take the config info and create tasks, passing them to the TaskQueue");

	xit("Will start the TaskQueue running and listen for the 'complete' event");

	xit("Will copy over all .jpg files and the data.json file from the temp directory to the location specified in the config");

	xit("Will delete the temporary directory once copying is complete");
});