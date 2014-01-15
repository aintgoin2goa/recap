
interface IBrowserSwarm{

	execute(script : string) : number;

	on(event: string, handler: Function) : void;

}