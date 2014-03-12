/// <reference path="../IConfig.ts" />
/// <reference path="../ITempDir.ts" />

interface ITask{

	status: number;

	url : string;

	widths: number[];

	options: IUrlOptions;

	scriptTemplate: string;

	generatedScript: string;

	generateScript(tempDir: ITempDir): void;

	removeScript(): void;
}