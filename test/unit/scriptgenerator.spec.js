var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var fsMock = nodeMocks.getFSMock();
var localMocks = require("../mocks/localMocks.js")
var tmpDirMock = localMocks.getTempDirMock();
var configMock = localMocks.getMockConfig()
var ScriptGenerator = loader.loadModule("./js/ScriptGenerator.js", {"fs" : fsMock, "./Config" : configMock}).module.exports;

var fs = require("fs");
var path = require("path");
var scriptGenerator;

describe("ScriptGenerator", function(){

	beforeEach(function(){
		scriptGenerator = ScriptGenerator.getInstance();
	})

	it("Can generate a javascript file given a template and a context", function(){
		var url = "http://www.paul.com";
		var template = fs.readFileSync(path.resolve("./test/templates/testTemplate1.tmpl"), {encoding : "utf8"});
		fsMock.setReadFileData(template);
		
		var script = scriptGenerator.generate({"url" : url});

		expect(script).toContain(url);
	});

	it("Can save the file with a random name in the tmp directory", function(){
		var url = "http://www.paul.com";
		var expectedPath = path.resolve(tmpDirMock.dir);
		var template = fs.readFileSync(path.resolve("./test/templates/testTemplate1.tmpl"), {encoding : "utf8"});
		fsMock.setReadFileData(template);
		
		var script = scriptGenerator.generate({"url" : url});
		scriptGenerator.save(script, tmpDirMock);

		expect(fsMock.writeFileSync.mostRecentCall.args[0]).toContain(expectedPath);

	});

});