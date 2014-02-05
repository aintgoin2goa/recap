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
		var templatePath = "./test/templates/testTemplate1.tmpl";
		var template = fs.readFileSync(templatePath, {encoding:"utf8"});
		fsMock.setReadFileData(template);
		var url = "http://www.paul.com";
		
		var script = scriptGenerator.generate(templatePath, {"url" : url});

		expect(script).toContain(url);
	});

	it("Can save the file with a random name in the tmp directory", function(){
		var templatePath = "./test/templates/testTemplate1.tmpl";
		var template = fs.readFileSync(templatePath, {encoding:"utf8"});
		fsMock.setReadFileData(template);
		var url = "http://www.paul.com";
		var expectedPath = path.resolve(tmpDirMock.dir);
		
		var script = scriptGenerator.generate(templatePath, {"url" : url});
		scriptGenerator.save(script, tmpDirMock);

		expect(fsMock.writeFileSync.mostRecentCall.args[0]).toContain(expectedPath);

	});

});