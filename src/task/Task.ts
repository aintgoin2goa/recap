/// <reference path="./ITask.ts" />
/// <reference path="../ITempDir.ts" />
/// <reference path="../IScriptGenerator.ts" />
/// <reference path="../d/node.d.ts" />

import TaskStatus = require("./TaskStatus");
import ScriptGenerator = require("../ScriptGenerator");
import fs = require("fs");
import path = require("path");

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
		this.status = TaskStatus.UNKNOWN;
	}

	public generateScript(tempDir: ITempDir): void {
		debugger;
		var generator = ScriptGenerator.getInstance();
		var widthsString = JSON.stringify(this.widths);
		var optionsString = JSON.stringify(this.options);
		var context = {
			url : this.url,
			widths : widthsString,
			options : optionsString,
			tempDirPath : encodeURI(tempDir.dir + path.sep)
		};

		var script = generator.generate(context, this.options.script);
		this.generatedScript = generator.save(script, tempDir);
	}

	public removeScript(): void {
		fs.unlinkSync(this.generatedScript);
	}
}

export = Task;