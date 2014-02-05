var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var localMocks = require("../mocks/localMocks.js");
var MockBrowser = localMocks.getMockBrowser();

var BrowserSwarm = loader.loadModule("./js/browsers/BrowserSwarm.js", {"./PhantomBrowser" : MockBrowser}).module.exports;

describe("Swarm", function(){

	beforeEach(function(){
		localMocks.resetMockBrowserInstances();
	});

	it("Will instantiate the given number of Browser objects", function(){
		new BrowserSwarm(4);

		expect(MockBrowser.callCount).toBe(4);
	});

	it("Can execute a script, returning the index of the browser responsible", function(){
		MockBrowser.prototype.status = 0;
		var swarm = new BrowserSwarm(4);

		var index1 = swarm.execute("script.js");
		var index2 = swarm.execute("script.js");

		expect(index1).toBe(0);
		expect(index2).toBe(1);
	});

	it("Will return -1 if no browser is available", function(){
		MockBrowser.prototype.status = 1;
		var swarm = new BrowserSwarm(4);

		var index = swarm.execute("script.js");

		expect(index).toBe(-1);
	});

	it("Will pass on any 'message' events from the browser", function(){
		var data = {title:"title",data:"data"};
		var spy =  jasmine.createSpy("message")
		var index = 0;
		var swarm = new BrowserSwarm(4);
		var mockBrowser = localMocks.getMockBrowserInstance(index);
		
		swarm.on("message",spy);
		mockBrowser.fire("message", data);

		waits(10);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(data, index);
		})
	});

	it("Will pass on any 'error' events from the browser, and disconnect the process", function(){
		var error = new Error("Something went wrong");
		var spy =  jasmine.createSpy("error")
		var index = 0;
		var swarm = new BrowserSwarm(4);
		var mockBrowser = localMocks.getMockBrowserInstance(index);
		
		swarm.on("error",spy);

		mockBrowser.fire("error", error, null);

		waits(10);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(error, index);
		})
	});

	it("Will fire an 'available' event when a browser completes it's task", function(){
		var spy =  jasmine.createSpy("available")
		var index = 0;
		var swarm = new BrowserSwarm(4);
		var mockBrowser = localMocks.getMockBrowserInstance(index);
		
		swarm.on("available",spy);

		mockBrowser.fire("complete");

		waits(10);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(index);
		})
	});

});