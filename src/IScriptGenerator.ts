/// <reference path="./ITempDir" />

interface IScriptGenerator{

	generate(templatePath: string, tempDir: ITempDir) : string;

	save(tempDir: ITempDir) : string;

}