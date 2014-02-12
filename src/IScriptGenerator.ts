/// <reference path="./ITempDir" />

interface IScriptGenerator{

	generate(context: any, userScript?: string) : string;

	save(script: string, tempDir: ITempDir) : string;

}