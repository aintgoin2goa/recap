/// <reference path="./IBrowserSwarm.ts" />
/// <reference path="./IBrowser.ts" />

import Browser = require("PhantomBrowser");
import BrowserStatus = require("BrowserStatus");

class BrowserSwarm implements IBrowserSwarm{

	private browsers: IBrowser[];

	private eventHandlers : {[event: string] : {(err:any, data:any, index:number) : void}[]};

	constructor(maxInstances: number){
		this.browsers = [];
		for(var i = 0; i < maxInstances; i++){
			this.browsers.push(new Browser());
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

	public on(event: string, handler: (err:any, data:any, index:number) => void): void{
		if(this.eventHandlers[event]){
			this.eventHandlers[event].push(handler);
		}else{
			this.eventHandlers[event] = [handler];
		}
	}

	private trigger(event: string, err: any, data: any, index: number){
		if(!this.eventHandlers[event]){
			return;
		}

		this.eventHandlers[event].forEach(function(handler){
			handler(err, data, index);
		});
	}

	private addListeners(browser: IBrowser, index: number){
		browser.on("message", (message) => this.onMessage(message, browser, index) );
		browser.on("error", (error) => this.onError(error, browser, index) );
		browser.on("exit", () => this.onExit(browser,index) );
	}

	private onMessage(message: IBrowserMessage, browser: IBrowser, index: number){

	}

	private onError(error: any, browser: IBrowser, index: number){

	}

	private onExit(browser: IBrowser, index: number){

	}
}

export = BrowserSwarm;