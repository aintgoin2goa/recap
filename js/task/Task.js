var TaskStatus = require("./TaskStatus");
var ScriptGenerator = require("../ScriptGenerator");
var fs = require("fs");

var Task = (function () {
    function Task(url, widths, options) {
        this.url = url;
        this.widths = widths;
        this.options = options;
        this.scriptTemplate = this.options.script;
        this.status = TaskStatus.UNKNOWN;
    }
    Task.prototype.generateScript = function (tempDir) {
        var generator = new ScriptGenerator();
        var widthsString = "[" + this.widths.join(",") + "]";
        generator.generate(this.scriptTemplate, { url: this.url, widths: widthsString });
        this.generatedScript = generator.save(tempDir);
    };

    Task.prototype.removeScript = function () {
        fs.unlinkSync(this.generatedScript);
    };
    return Task;
})();


module.exports = Task;

