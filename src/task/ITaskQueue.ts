/// <reference path="./ITask.ts" />

interface ITaskQueue{

	length: number;

	complete: number;

	addTask(task: ITask): void;

	process(): void;

	on(event: string, handler: () => void): void;
	on(event: "complete", hander: () => void): void;

}