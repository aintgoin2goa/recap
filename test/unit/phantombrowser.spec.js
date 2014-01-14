var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var child_processMock = nodeMocks.getMockChildProcess();
var MockChildProcess = nodeMocks.MockChildProcess;
var PhantomBrowser = loader.loadModule("./js/browsers/PhantomBrowser.js", {"child_process" : child_processMock}).module.exports;

var BrowserStatus = require("../../js/browsers/BrowserStatus.js");

describe("PhantomBrowser", function(){

	var browser;

	beforeEach(function(){
		MockChildProcess.reset();
	});

	it("Can check that phantomjs is available", function(done){
		PhantomBrowser.test()

		.then(function(){
			expect(child_processMock.exec).toHaveBeenCalledWith("phantomjs -v", jasmine.any(Object), jasmine.any(Function));
			done();
		});
	});

	it("Can execute phantomjs with a given script", function(){
		browser = new PhantomBrowser();
		var script = "script.js";

		browser.execute(script);

		expect(child_processMock.spawn).toHaveBeenCalledWith("phantomjs", [script]);
	});

	it("Will listen to the stdout of the process and fire the 'message' event when data is received", function(done){
		browser = new PhantomBrowser();
		var script = "script.js";
		var spy = jasmine.createSpy("messageCallback");
		var message = {title : "Stuff", data : "blah blah"};

		browser.execute(script);
		browser.on("message", spy);

		MockChildProcess.stdout.fire("data", null, JSON.stringify(message));

		waits(50);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(message);
			done();
		});

	});

	it("Will fire the 'error' event and update it's status if the process errors", function(done){
		browser = new PhantomBrowser();
		var script = "script.js";
		var spy = jasmine.createSpy("errorCallback");
		var error = new Error("Some Error");

		browser.execute(script);
		browser.on("error", spy);

		MockChildProcess.fire("error", error, null);

		waits(50);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(error, null);
			expect(browser.status).toBe("ERROR");
			done();
		});
	});

	it("Will fire the 'complete' event and update it's status when the process exits", function(done){
		browser = new PhantomBrowser();
		var script = "script.js";
		var spy = jasmine.createSpy("completeCallback");

		browser.execute(script);
		browser.on("complete", spy);

		MockChildProcess.fire("exit", null, null);

		waits(50);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(null, null);
			expect(browser.status).toBe("COMPLETE");
			done();
		});
	});

	it("Can close the process", function(){
		browser = new PhantomBrowser();
		var script = "script.js";

		browser.execute(script);
		browser.close();

		expect(MockChildProcess.disconnect).toHaveBeenCalled();

	});

});   