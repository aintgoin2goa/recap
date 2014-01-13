/// <reference path="./IBrowser.ts" />
/// <reference path="../d/node.d.ts" />

import child_process = require("child_process");
import console = require("../Console");
import BrowserStatus = require("./BrowserStatus");

class PhantomBrowser implements IBrowser{

	public status : Number;

	private instance : any;

	private eventHandlers : {[event : string] : {(err : any, data? : any) :void}[]}

	constructor(){
		this.eventHandlers = {};
		this.testPhantom();
	}

	public execute(scriptPath : string) : void {
		var process = child_process.spawn("phantomjs", [scriptPath]);
		process.on("error", (err:any) => this.onError(err) );
		process.on("exit", () => this.onExit() );
		process.stdout.on("data", (data) => this.onMessage(data) );
	}

	public close() : void {

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
		this.fire("error", err, null);
	}

	private onExit() : void{
		this.status = BrowserStatus.COMPLETE;
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

	private testPhantom() : void{
		child_process.exec("phantomjs -v", {}, function(err, stdout, stderr){
			if(err){
				console.error("Phantom js not found, please check it is installed and available in your PATH");
				this.status = BrowserStatus.ERROR;
			}else{
				console.log("Phantom js found - version " + stdout.toString());
				this.status = BrowserStatus.READY;
			}
		});
	}

}

export = PhantomBrowser;