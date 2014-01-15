/// <reference path="../d/Q.d.ts" />



interface IBrowserMessage{
	title : string;
	data : any;
}

interface IBrowser{

	status : number;

	execute(scriptPath: string) : void;

	close(force? : boolean) : void;

	on(event: string, handler : (err : any, data : any) => void);

	fire(event : string, err : any, data : any);

}