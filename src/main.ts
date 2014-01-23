/// <reference path="d/node.d.ts" />
/// <reference path="d/q.d.ts" />
/// <reference path="./Iconfig.ts" />
/// <reference path="browsers/IBrowserSwarm.ts" />

import Q = require("q");
import fs = require("fs");
import BrowserSwarm = require("browsers/BrowserSwarm");

var fail = function fail(message: string, dfd:Q.Deferred<any>): void {
	throw new Error("Not implemented");
}

function setupFail(isConsole:boolean) : void{
	if(isConsole){
		fail = function fail(message: string, dfd:Q.Deferred<any>): void {
			console.error(message);
			process.exit(1);
		}
	}else{
		fail = function fail(message: string, dfd?:Q.Deferred<any>): void {
			dfd.reject(message);
		}
	}
}

function loadConfig(path: string): IConfig {
	var configstr =  fs.readFileSync(path, {encoding:"utf8"});
	var config;
	try{
		config = JSON.parse(configstr);
	}catch(e){
		return false;
	}
	return config ? config : false;
}

function setup(config:IConfig, dfd:Q.Deferred<any>): void {
	var swarm = new BrowserSwarm(config.settings.maxInstances);
}

export function run(config:string, isConsole?:boolean): Q.IPromise<any>
export function run(config:IConfig, isConsole?:boolean): Q.IPromise<any> 
export function run(config:any, isConsole?:boolean): Q.IPromise<any>
{
	var dfd = Q.defer();
	isConsole = isConsole || false;
	setupFail(isConsole);

	if(typeof config === "string"){
		config = loadConfig(config);
		if(!config){
			fail("Could not parse config object", dfd);
		}
	}

	setup(config, dfd);
	return dfd.promise;
}