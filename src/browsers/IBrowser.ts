/// <reference path="../d/Q.d.ts" />


interface IBrowserMessage{
	title : string;
	data : any;
}

interface IBrowser{

	status : string;

	execute(scriptPath: string) : void;

	close() : void;

	on(event: string, handler : (err : any, data : any) => void);

	fire(event : string, err : any, data : any);

}