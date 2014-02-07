/// <reference path="./ITempDir" />

interface IScriptGenerator{

	generate(context: any) : string;

	save(script: string, tempDir: ITempDir) : string;

}