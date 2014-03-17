/// <reference path="./ErrorBase.ts" />

import ErrorBase = require("./ErrorBase");

class FileNotFoundError extends ErrorBase{

	constructor(message: string){
		super(message);
		this.name = "File Not Found";
		this.message = message;
	}
}

export = FileNotFoundError;