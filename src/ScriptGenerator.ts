/// <reference path="./IScriptGenerator.ts" />
/// <reference path="./ITempDir.ts" />
/// <reference path="d/node.d.ts" />
/// <reference path="d/handlebars.d.ts" />

import path = require("path");
import fs = require("fs");
import Handlebars = require("handlebars");
import _ = require("underscore");

class ScriptGenerator implements IScriptGenerator{

	private templatesFolderPath: string = path.resolve("./templates/");

	private generatedScript: string;

	private compiledTemplate : Function;

	public generate(templatePath: string, context : Object) : string {
		var template = this.loadTemplate(templatePath);
		this.compileTemplate(template);
		this.generatedScript = this.generateTemplate(context);
		return this.generatedScript;
	}

	public save(tempDir : ITempDir) : string {
		var filename = this.generateUniqueFileName()
		var pth = path.resolve(tempDir.dir, filename);
		fs.writeFileSync(pth, this.generatedScript, {encoding : "utf8"});
		return filename;
	}

	private loadTemplate(templatePath: string) : string {
		var pth = templatePath.indexOf(".") > -1 ? path.resolve(templatePath) : path.resolve(this.templatesFolderPath, templatePath + ".tmpl");
		return fs.readFileSync(pth, {encoding : "utf8"});
	} 

	private compileTemplate(template: string) : void {
		this.compiledTemplate =  Handlebars.compile(template);
	}

	private generateTemplate(context : any) : string {
		return this.compiledTemplate(context);
	}

	private generateUniqueFileName() : string {
		var filename = "";
		for(var i=0; i < 32; i++){
			filename += this.generateHexChar();
		}
		return filename + ".js";
	}

	private generateHexChar() : string {
		return _.random(0, 15).toString(16);
	}

}
export = ScriptGenerator;