/// <reference path="../d/Q.d.ts" />

interface IBrowserMessage{
	title : string;
	data : any;
}

interface IBrowser{

	messages : IBrowserMessage[];

	execute(scriptPath: string) : Q.IPromise<any>;

	close() : void;

}