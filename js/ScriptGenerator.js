var path = require("path");
var fs = require("fs");
var Handlebars = require("handlebars");
var _ = require("underscore");
var config = require("./Config");

var ScriptGenerator = (function () {
    function ScriptGenerator() {
        this.templatesFolderPath = this.installLocation() + "templates" + path.sep;
        this.templateExtension = ".tmpl";
        this.config = config.getCurrentConfig();
    }
    ScriptGenerator.prototype.generate = function (context, userScript) {
        if (!this.compiledTemplate) {
            var template = this.loadTemplate();
            this.compiledTemplate = this.compileTemplate(template);
        }

        this.addUserScript(userScript);

        return this.generateScript(context);
    };

    ScriptGenerator.prototype.save = function (script, tempDir) {
        var filename = this.generateUniqueFileName();
        var pth = path.resolve(tempDir.dir, filename);
        fs.writeFileSync(pth, script, { encoding: "utf8" });
        return pth;
    };

    ScriptGenerator.prototype.loadTemplate = function () {
        var pth = path.resolve(this.templatesFolderPath, this.config.settings.template + this.templateExtension);
        return fs.readFileSync(pth, { encoding: "utf8" });
    };

    ScriptGenerator.prototype.compileTemplate = function (template) {
        return Handlebars.compile(template);
    };

    ScriptGenerator.prototype.generateScript = function (context) {
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

    ScriptGenerator.prototype.installLocation = function () {
        var location;
        try  {
            location = require.resolve("recap");
        } catch (e) {
            var qPath = require.resolve("q");
            location = qPath.split("node_modules")[0];
        }
        return location;
    };

    ScriptGenerator.prototype.loadUserScript = function (userScriptPath) {
        var pth = path.resolve(userScriptPath);
        return fs.readFileSync(pth, { encoding: "utf8" });
    };

    ScriptGenerator.prototype.addUserScript = function (script) {
        if (!script) {
            Handlebars.registerPartial("userscript", "");
            return;
        }

        var partial = this.compileTemplate(this.loadUserScript(script));
        Handlebars.registerPartial("userscript", partial);
    };
    return ScriptGenerator;
})();

var instance;

function getInstance() {
    if (!instance) {
        instance = new ScriptGenerator();
    }

    return instance;
}
exports.getInstance = getInstance;

