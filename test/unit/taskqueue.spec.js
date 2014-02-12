var loader = require("../helpers/moduleLoader.js");
var nodeMocks = require("../mocks/nodeMocks.js");
var localMocks = require("../mocks/localMocks.js");

var TaskStatus = require("../../js/task/TaskStatus.js");
var TempDirMock = localMocks.getTempDirMock();
var BrowserSwarmMock = localMocks.getBrowserSwarmMock();
var ConsoleMock = localMocks.getMockConsole();
var TaskMock = localMocks.getTaskMock();

var TaskQueue = loader.loadModule("./js/task/TaskQueue.js", {"../Console" : ConsoleMock, "./Task" : TaskMock}).module.exports;

describe("TaskQueue", function(){

	var taskQueue;
	var createdTasks;

	beforeEach(function(){
		BrowserSwarmMock.reset();
		createdTasks = [];
		taskQueue = new TaskQueue(BrowserSwarmMock, TempDirMock);
	});

	function createTask(url){
		var task = new TaskMock(url, [100,200], {script:"script"});
		createdTasks.push(task);
		return task;
	}

	it("Can add a new task to the queue", function(){
		taskQueue.addTask(createTask("url", 0));

		expect(taskQueue.length).toBe(1);
	});

	it("Will not add a task if another task with the same url already exists", function(){
		taskQueue.addTask(createTask("url", 0));
		taskQueue.addTask(createTask("url", 0));

		expect(taskQueue.length).toBe(1);
	});

	it("Will call the generateScript method on the task and update it's status to QUEUED before adding it", function(){
		var task = createTask("url", 0);

		taskQueue.addTask(task);

		expect(task.status).toBe(TaskStatus.QUEUED);
		expect(task.generateScript).toHaveBeenCalled();
	});

	it("Will listen for 'message' events and pass them to the console", function(){
		var message = {title:"log", content : "log message"};
		var task = createTask("url", 0);
		
		taskQueue.addTask(task);
		BrowserSwarmMock.fire("message", message);

		waits(10);

		runs(function(){
			expect(ConsoleMock.log).toHaveBeenCalledWith(message.content)
		});
	});

	it("Will listen for 'message' events with title 'crawlresult' and add the given urls to the queue", function(){
		var message = {title:"crawlresult", content:["url1", "url2"]};
		var task = createTask("url", 0);
		taskQueue.addTask(task);

		taskQueue.process();
		BrowserSwarmMock.setExecuteReturn(-1);

		BrowserSwarmMock.fire("message", message);

		waits(10);

		runs(function(){
			expect(taskQueue.length).toBe(2);
		});

	});

	it("Will listen for 'error' events and put the failed task back in the queue", function(){
		var err = new Error("Error");
		var task = createTask("url");
		taskQueue.addTask(task);

		taskQueue.process();
		BrowserSwarmMock.setExecuteReturn(-1);

		BrowserSwarmMock.fire("error", err, 0);

		waits(10);

		runs(function(){
			expect(task.status).toBe(TaskStatus.FAILED);
			expect(taskQueue.length).toBe(1);
		});
	});

	it("Will listen for 'available' events, put the completed task in the completed list and start a new task", function(){
		var index = 0;
		var task1 = createTask("url1");
		var task2 = createTask("url2");
		taskQueue.addTask(task1);
		taskQueue.addTask(task2);
		taskQueue.process();

		BrowserSwarmMock.fire("available", index);

		waits(10);

		runs(function(){
			expect(taskQueue.complete).toBe(1);
			expect(task1.status).toBe(TaskStatus.COMPLETE);
			expect(task2.status).toBe(TaskStatus.RUNNING);
		});
	});

	it("Will fire a complete event when all tasks are processed", function(){
		var index = 0;
		var task1 = createTask("url1");
		var spy = jasmine.createSpy("complete");

		taskQueue.addTask(task1);
		taskQueue.on("complete", spy);
		taskQueue.process();

		BrowserSwarmMock.fire("available", index);

		waits(10);

		runs(function(){
			expect(spy).toHaveBeenCalled();
		});
	});

});