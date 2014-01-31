/// <reference path="./ITempDir" />

interface IScriptGenerator{

	generate(templatePath: string, context: any) : string;

	save(tempDir: ITempDir) : string;

}