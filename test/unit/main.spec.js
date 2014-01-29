var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var localMocks = require("../mocks/localMocks.js");

var fsMock = nodeMocks.getFSMock();
var BrowserSwarmMock = localMocks.getBrowserSwarmMockConstructor();
var TempDirMock = localMocks.getTempDirMockConstructor();
var TaskQueueMock = localMocks.getTaskQueueMock();
var destinationMock = localMocks.getMockDestination();
var destinationResolverMock = localMocks.getMockDestinationResolver(destinationMock);
var transportMock = localMocks.getMockTransportFactory();

var main = loader.loadModule("./js/main.js", {
	"fs" : fsMock, 
	"./browsers/BrowserSwarm" : BrowserSwarmMock, 
	"./TempDir" : TempDirMock,
	"./task/TaskQueue" : TaskQueueMock,
	"./destinations/DestinationResolver" : destinationResolverMock,
	"./transports/transportFactory" : transportMock
}).module.exports;

var fs = require("fs");
var path = require("path");

var config = require("../data/config.json");

describe("main", function(){

	beforeEach(function(){
		BrowserSwarmMock.reset();
		localMocks.reset();
	});	

	it("can be called with a config object and will return a promise", function(){
		var promise = main.run(config);
		
		expect(promise).not.toBeNull();
	});

	it("Will instantiate a new BrowserSwarm with the number of instances given in config file", function(){
		main.run(config);

		expect(BrowserSwarmMock).toHaveBeenCalledWith(config.settings.maxInstances);
	});

	it("Will create a temporary directory", function(){
		main.run(config);

		expect(TempDirMock).toHaveBeenCalled();
	});

	it("Will instantiate a new TaskQueue", function(){
		main.run(config);

		var swarm = localMocks.getBrowserSwarmMockInstance(0);
		var tempDir = localMocks.getTempDirMockInstance(0);

		expect(TaskQueueMock).toHaveBeenCalledWith(swarm, tempDir);
	});

	it("Will take the config info and create tasks, passing them to the TaskQueue", function(){
		var urls = Object.keys(config.urls);

		main.run(config);

		var taskQueue = localMocks.getTaskQueueMockInstance(0);
		urls.forEach(function(url, index){
			expect(taskQueue.addTask).toHaveBeenCalled();
			expect(taskQueue.addTask.argsForCall[index][0].url).toBe(url);
		});
	});

	it("Will start the TaskQueue running and listen for the 'complete' event", function(){
		main.run(config);

		var taskQueue = localMocks.getTaskQueueMockInstance(0);

		expect(taskQueue.process).toHaveBeenCalled();
		expect(taskQueue.on).toHaveBeenCalledWith("complete", jasmine.any(Function));
	});

	it("Will copy over all .jpg files and the data.json file from the temp directory to the location specified in the config", function(){
		main.run(config);

		var taskQueue = localMocks.getTaskQueueMockInstance(0);
		var tempDir = localMocks.getTempDirMockInstance(0);
		taskQueue.trigger("complete");

		expect(transportMock).toHaveBeenCalledWith(tempDir);
		expect(transportMock.to).toHaveBeenCalledWith(destinationMock);
	});

	it("Will delete the temporary directory once copying is complete", function(){
		main.run(config);

		var taskQueue = localMocks.getTaskQueueMockInstance(0);
		var tempDir = localMocks.getTempDirMockInstance(0);
		taskQueue.trigger("complete");

		expect(transportMock.to).toHaveBeenCalledWith(destinationMock);
	});
});