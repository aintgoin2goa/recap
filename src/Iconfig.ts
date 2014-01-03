interface IConfig{

    urls: {[url: string]: IUrlOptions};

    widths: number[];

    dest: string;

    defaultOptions: IUrlOptions;

}

interface IUrlOptions {

    waitTime: number;

    crawl: boolean;

    scripts : IScriptOptions;

}

interface IScriptOptions {

    before: string;

    after: string;
}

interface IConfigValidationResult{
	
	result: boolean;

	message: string;
}
