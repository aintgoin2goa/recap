/// <reference path="../d/Q.d.ts" />
/// <reference path="./BrowserStatus.ts" />

declare enum BrowserStatus{
	READY,
	ACTIVE,
	COMPLETE,
	ERROR
}

interface IBrowserMessage{
	title : string;
	data : any;
}

interface IBrowser{

	status : Number;

	execute(scriptPath: string) : void;

	close() : void;

	on(event: string, handler : (err : any, data : any) => void);

	fire(event : string, err : any, data : any);

}