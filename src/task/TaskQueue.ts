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
		if(this.urls.indexOf(task.url) != -1){
			return;
		}

		task.status = TaskStatus.QUEUED;
		task.generateScript(this.tempDir);
		this.urls.push(task.url);
		this.queue.push(task);
	}

	public process(): void {
		for(var i=0, l=this.running.length; i<l; i++){
			this.next(i);
		}
	}

	public on(event: string, handler: () => void): void{
		if(this.events[event]){
			this.events[event].push(handler);
		}else{
			this.events[event] = [handler];
		}
	}

	private next(index: number):  void{
		if(this.length === 0){
			this.trigger("complete");
			return;
		}

		var task = this.queue.shift();
		task.status = TaskStatus.RUNNING;
		this.running[index] = task;
		this.swarm.execute(task.generatedScript);
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
		this.swarm.on("message",(message, index) => this.onMessage(message));
		this.swarm.on("error", (error, index) => this.onError(error,index));
		this.swarm.on("available", (index) => this.onAvailable(index));
	}

	private onMessage(message: {title:string; content:any}): void{
		if(console[message.title]){
			console[message.title](message.content);
		}

		if(message.title === "crawlresult" && message.content.forEach){
			message.content.forEach((url) => this.addUrl(url));
		}
	}

	private onError(error: Error, index:number): void{
		console.error(error.message);
		this.taskFailed(index);
	}

	private onAvailable(index:number): void{
		this.taskSucceeded(index);
		this.next(index);
	}

	private taskFailed(index:number): void{
		var task = this.running[index];
		task.status = TaskStatus.FAILED;
		this.queue.push(task);
		this.running[index] = null;
	}

	private taskSucceeded(index:number): void{
		var task = this.running[index];
		task.status = TaskStatus.COMPLETE;
		this.completed.push(task);
		this.running[index] = null;
	}

	private addUrl(url: string) : void{
		var baseTask = this.completed.length ? this.completed[0] : this.queue[0];
		var task = new Task(url, baseTask.widths, baseTask.options);
		this.addTask(task);
	}

}

export = TaskQueue;