var path = require("path");
var fs = require("fs");
var Handlebars = require("handlebars");
var _ = require("underscore");

var ScriptGenerator = (function () {
    function ScriptGenerator() {
        this.templatesFolderPath = path.resolve("./templates/");
    }
    ScriptGenerator.prototype.generate = function (templatePath, context) {
        var template = this.loadTemplate(templatePath);
        this.compileTemplate(template);
        this.generatedScript = this.generateTemplate(context);
        return this.generatedScript;
    };

    ScriptGenerator.prototype.save = function (tempDir) {
        var filename = this.generateUniqueFileName();
        var pth = path.resolve(tempDir.dir, filename);
        fs.writeFileSync(pth, this.generatedScript, { encoding: "utf8" });
        return filename;
    };

    ScriptGenerator.prototype.loadTemplate = function (templatePath) {
        var pth = templatePath.indexOf(".") > -1 ? path.resolve(templatePath) : path.resolve(this.templatesFolderPath, templatePath + ".tmpl");
        return fs.readFileSync(pth, { encoding: "utf8" });
    };

    ScriptGenerator.prototype.compileTemplate = function (template) {
        this.compiledTemplate = Handlebars.compile(template);
    };

    ScriptGenerator.prototype.generateTemplate = function (context) {
        return this.compiledTemplate(context);
    };

    ScriptGenerator.prototype.generateUniqueFileName = function () {
        var filename = "";
        for (var i = 0; i < 32; i++) {
            filename += this.generateHexChar();
        }
        return filename + ".js";
    };

    ScriptGenerator.prototype.generateHexChar = function () {
        return _.random(0, 15).toString(16);
    };
    return ScriptGenerator;
})();

module.exports = ScriptGenerator;

