
class ErrorBase implements Error{

	public name: string;

	public message: string;

	constructor(message: string){
		this.name = "Error";
		this.message = message;
	}
}

export = ErrorBase;