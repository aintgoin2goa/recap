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

	it("Will check that phantomjs is available when instantiated", function(done){
		browser = new PhantomBrowser();

		waits(500);

		runs(function(){
			expect(child_processMock.exec).toHaveBeenCalledWith("phantomjs -v", jasmine.any(Object), jasmine.any(Function));
			expect(browser.status === BrowserStatus.READY);
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

		debugger;
		MockChildProcess.stdout.fire("data", null, JSON.stringify(message));

		waits(50);

		runs(function(){
			expect(spy).toHaveBeenCalledWith(message);
			done();
		});

	});

	xit("Will fire the 'error' event and update it's status if the process errors");

	xit("Will fire the 'complete' event and update it's status when the process exits");

	xit("Can close the process");

});