/// <reference path="./ITempDir" />

interface IScriptGenerator{

	generate(templatePath: string, context: any) : string;

	save(script: string, tempDir: ITempDir) : string;

}