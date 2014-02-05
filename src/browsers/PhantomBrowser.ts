/// <reference path="./IBrowser.ts" />
/// <reference path="../d/node.d.ts" />

import child_process = require("child_process");
import console = require("../Console");
import BrowserStatus = require("./BrowserStatus");
import Q = require("q");

class PhantomBrowser implements IBrowser{

	public status : number;

	private instance : child_process.ChildProcess;

	private eventHandlers : {[event : string] : {(err : any, data? : any) :void}[]}

	constructor(index: number){
		this.eventHandlers = {};
		this.status = BrowserStatus.IDLE;
	}

	public execute(scriptPath : string) : void {
		console.log("about to execute phantomjs " + scriptPath);
		var child = child_process.spawn("phantomjs", [scriptPath]);
		child.on("error", (err:any) => this.onError(err) );
		child.on("exit", (code: number) => this.onExit(code) );
		child.stdout.on("data", (data) => this.onMessage(data) );
		child.stderr.on("data", (data) => this.onError(data) );
		this.instance = child;
	}

	public close(force?: boolean) : void {
		if(force){
			this.instance.kill();
		}else{
			this.instance.disconnect();
		}
		this.status = BrowserStatus.IDLE;
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
		this.status = BrowserStatus.ERROR;
		if(Buffer.isBuffer(err)){
			err = err.toString();
		}

		console.log("PhantomBrowser: process errored, " + (err.message || err));
		this.fire("error", err, null);
	}

	private onExit(code : number) : void{
		console.log("PhantomBrowser: process exited with code " + code);
		if(code === 0){
			this.status = BrowserStatus.IDLE;
			this.fire("complete", null, null);
		}else{
			this.onError(null);
		}
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