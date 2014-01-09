var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var fsMock = nodeMocks.getFSMock();
var tmpDirMock = require("../mocks/localMocks.js").getTempDirMock();
var ScriptGenerator = loader.loadModule("./js/ScriptGenerator.js", {"fs" : fsMock}).module.exports;

var fs = require("fs");
var path = require("path");
var scriptGenerator;

describe("ScriptGenerator", function(){

	beforeEach(function(){
		scriptGenerator = new ScriptGenerator();
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
		
		scriptGenerator.generate(templatePath, {"url" : url});
		scriptGenerator.save(tmpDirMock);

		expect(fsMock.writeFileSync.mostRecentCall.args[0]).toContain(expectedPath);

	});

});