/// <reference path="./IBrowser.ts" />
/// <reference path="../d/node.d.ts" />

class PhantomBrowser implements IBrowser{

	public messages : IBrowserMessage[];

	private instance : any;

	constructor(){

	}

	public execute(scriptPath : string) : Q.IPromise<any> {
		var dfd = Q.defer<any>();

		return dfd.promise;
	}

	public close() : void {

	}

}