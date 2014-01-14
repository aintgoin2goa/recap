/// <reference path="./IBrowser.ts" />
/// <reference path="../d/node.d.ts" />

import child_process = require("child_process");
import console = require("../Console");
import Q = require("q");

class PhantomBrowser implements IBrowser{

	public status : string;

	private instance : child_process.ChildProcess;

	private eventHandlers : {[event : string] : {(err : any, data? : any) :void}[]}

	constructor(){
		this.eventHandlers = {};
		this.status = "IDLE";
	}

	public execute(scriptPath : string) : void {
		var child = child_process.spawn("phantomjs", [scriptPath]);
		child.on("error", (err:any) => this.onError(err) );
		child.on("exit", () => this.onExit() );
		child.stdout.on("data", (data) => this.onMessage(data) );
		this.instance = child;
	}

	public close() : void {
		this.instance.disconnect();
	}

	public on(event : string, handler : (err:any, data?:any) => void) : void{
		if(this.eventHandlers[event]){
			this.eventHandlers[event].push(handler);
		}else{
			this.eventHandlers[event] = [handler];
		}
	}

	public fire(event : string, err : any, data : any): void{
		if(!this.eventHandlers[event]){
			return;
		}

		this.eventHandlers[event].forEach(function(handler){
			if(event === "message"){
				handler(data)
			}else{
				handler(err, data);
			}
		});
	}

	private onError(err:any) : void{
		this.status = "ERROR";
		this.fire("error", err, null);
	}

	private onExit() : void{
		this.status = "COMPLETE";
		this.fire("complete", null, null);
	}

	private onMessage(message : NodeBuffer) : void{
		var msg;
		try{
			msg = JSON.parse(message.toString());
			this.fire("message", null, msg);
		}catch(e){
			msg = message.toString();
			this.fire("log", null, msg);
		}
	}

	public static test() : Q.IPromise<boolean> {
		var dfd = Q.defer<boolean>();
		child_process.exec("phantomjs -v", {}, function(err, stdout, stderr){
			if(err){
				dfd.resolve(false);
			}else{
				dfd.resolve(true);
			}
		});
		return dfd.promise;
	}

}

export = PhantomBrowser;