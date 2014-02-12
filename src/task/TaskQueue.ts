/// <reference path="./ITaskQueue.ts" />
/// <reference path="../browsers/IBrowserSwarm.ts" />
/// <reference path="./Task.ts" />

import TaskStatus = require("./TaskStatus");
import console = require("../Console");
import Task = require("./Task");
import _ = require("underscore");

class TaskQueue implements ITaskQueue{

	get length(): number{
		return this.queue.length;
	}

	get complete(): number{
		return this.completed.length;
	}

	private swarm: IBrowserSwarm;

	private tempDir: ITempDir;

	private queue: ITask[];

	private running: ITask[];

	private completed: ITask[];

	private urls: string[];

	private events: {[event:string] : Function[]};

	constructor(swarm: IBrowserSwarm, tempDir: ITempDir){
		this.swarm = swarm;
		this.tempDir = tempDir;
		this.queue = [];
		this.running = [];
		this.running.length = swarm.size;
		this.completed = [];
		this.urls = [];
		this.events = {};
		this.addEventListeners();
	}

	public addTask(task: ITask): void{
		if(this.hasUrl(task.url)){
			return;
		}

		task.status = TaskStatus.QUEUED;
		task.generateScript(this.tempDir);
		this.urls.push(task.url );
		this.queue.push(task);
	}

	public process(): void {
		var i = 0;
		while(i < this.running.length && i< this.queue.length){
			this.next();
			i++;
		}
	}

	public on(event: string, handler: () => void): void{
		if(this.events[event]){
			this.events[event].push(handler);
		}else{
			this.events[event] = [handler];
		}
	}

	private next():  void{

		if(this.queue.length === 0){
			if(!this.hasRunningTasks() ){
				console.log("TaskQueue: complete");
				this.trigger("complete");
			}

			return;
		}

		var task = this.queue.shift();
		var index = this.swarm.execute(task.generatedScript);
		if(index > -1){
			task.status = TaskStatus.RUNNING;
			this.running[index] = task;
		}else{
			this.queue.push(task);
		}
	}

	private trigger(event: string): void{
		if(!this.events[event]){
			return;
		}

		this.events[event].forEach(function(handler){
			handler();
		});
	}

	private addEventListeners(): void{
		this.swarm.on("message",(message, index) => this.onMessage(message, index));
		this.swarm.on("error", (error, index) => this.onError(error,index));
		this.swarm.on("available", (index) => this.onAvailable(index));
	}

	private onMessage(message: {title:string; content:any}, index: number): void{

		if(console[message.title]){
			console[message.title](message.content);
		}

		if(message.title === "crawlresult" && message.content.forEach){
			console.log("crawl result", message.content);
			message.content.forEach((url) => this.addUrl(url, index));
		}

		if(message.title === "filesaved"){
			this.tempDir.createRecord(message.content.url,message.content.width);
		}
	}

	private onError(error: Error, index:number): void{
		console.error(error.message);
		this.taskFailed(index);
		this.next();
	}

	private onAvailable(index:number): void{
		console.log("TaskQueue: browser " + index  + " available, process next task");
		this.taskSucceeded(index);
		this.next();
	}

	private taskFailed(index:number): void{
		var task = this.running[index];
		if(task == null){
			console.error("No task found at index " + index);
			return;
		}
		task.status = TaskStatus.FAILED;
		this.queue.push(task);
		this.running[index] = null;
	}

	private taskSucceeded(index:number): void{
		var task = this.running[index];
		if(task == null){
			console.error("No task found at index " + index);
			return;
		}
		task.status = TaskStatus.COMPLETE;
		this.completed.push(task);
		this.running[index] = null;
	}

	private addUrl(url: string, index?: number) : void{
		index = index || 0;
		var baseTask = this.getBaseTask(index);
		var task = new Task(url, baseTask.widths, baseTask.options);
		this.addTask(task);
		if(this.queue.length){
			this.next();
		}
	}

	private getBaseTask(index: number): ITask {
		if(this.running[index]){
			return this.running[index];
		}

		if(this.completed.length){
			return this.completed[this.completed.length-1];
		}

		return this.queue[0];
	}

	private hasUrl(testUrl: string) : boolean {
		return this.urls.some((url) =>{
			return this.matchUrls(url, testUrl);
		});
	}

	private matchUrls(url1: string, url2: string): boolean {
		url1 = url1.replace(/\/$/,"");
		url2 = url2.replace(/\/$/,"");
		return (url1 === url2);
	}

	private hasRunningTasks(): boolean {
		return this.running.some(function(task){
			return task != null;
		});
	}
}

export = TaskQueue;