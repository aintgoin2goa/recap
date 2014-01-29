/// <reference path="./ITask.ts" />
/// <reference path="../ITempDir.ts" />
/// <reference path="../IScriptGenerator.ts" />
/// <reference path="../d/node.d.ts" />

import TaskStatus = require("./TaskStatus");
import ScriptGenerator = require("../ScriptGenerator");
import fs = require("fs");

class Task implements ITask{
	
	public status: number;

	public url : string;

	public widths: number[];

	public options: IUrlOptions;

	public scriptTemplate: string;

	public generatedScript: string;

	constructor(url: string, widths: number[], options: IUrlOptions){
		this.url = url;
		this.widths = widths;
		this.options = options;
		this.scriptTemplate = this.options.script;
		this.status = TaskStatus.UNKNOWN;
	}

	public generateScript(tempDir: ITempDir): void {
		var generator = new ScriptGenerator();
		var widthsString = JSON.stringify(this.widths);
		var optionsString = JSON.stringify(this.options);
		generator.generate(this.scriptTemplate, {url : this.url, widths:widthsString, options:optionsString});
		this.generatedScript = generator.save(tempDir);
	}

	public removeScript(): void {
		fs.unlinkSync(this.generatedScript);
	}
}

export = Task;