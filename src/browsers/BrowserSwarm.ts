/// <reference path="./IBrowserSwarm.ts" />
/// <reference path="./IBrowser.ts" />

import Browser = require("PhantomBrowser");
import BrowserStatus = require("BrowserStatus");

class BrowserSwarm implements IBrowserSwarm{

	get size(): number{
		return this.browsers.length;
	}

	private browsers: IBrowser[];

	private eventHandlers : {[event: string] : {(err?:any, data?:any, index?:number) : void}[]};

	constructor(maxInstances: number){
		this.eventHandlers = {};
		this.browsers = [];
		for(var i = 0; i < maxInstances; i++){
			var browser = new Browser(i);
			this.addListeners(browser,i);
			this.browsers.push(browser);
		}
	}

	public execute(script: string): number{
		for(var i=0, l=this.browsers.length; i<l; i++){
			if(this.browsers[i].status === BrowserStatus.IDLE){
				this.browsers[i].execute(script);
				return i;
			}
		}
		return -1;
	}

	public on(event: string, handler: (err?:any, data?:any, index?:number) => void): void{
		if(this.eventHandlers[event]){
			this.eventHandlers[event].push(handler);
		}else{
			this.eventHandlers[event] = [handler];
		}
	}

	private trigger(event: string, err?: any, data?: any, index?: number){
		if(!this.eventHandlers[event]){
			return;
		}

		this.eventHandlers[event].forEach(function(handler){
			if(event === "message"){
				handler(data, index);
			}else if(event === "error"){
				handler(err, index);
			}else if(event === "available"){
				handler(index);
			}else{
				handler(err, data, index);
			}
		});
	}

	private addListeners(browser: IBrowser, index: number){
		browser.on("message", (message) => this.onMessage(message, browser, index) );
		browser.on("error", (error) => this.onError(error, browser, index) );
		browser.on("exit", () => this.onExit(browser,index) );
	}

	private onMessage(message: IBrowserMessage, browser: IBrowser, index: number){
		this.trigger("message", null, message, index);
	}

	private onError(error: any, browser: IBrowser, index: number){
		this.trigger("error",error,null,index);
		browser.close(true);
	}

	private onExit(browser: IBrowser, index: number){
		this.trigger("available", null, null, index);
	}
}

export = BrowserSwarm;