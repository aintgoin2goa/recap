interface IConfig{

    urls: {[url: string]: IUrlOptions};

    widths: number[];

    dest: string;

    defaultOptions: IUrlOptions;

}

interface IUrlOptions {

    waitTime: number;

    crawl: boolean;

    login: ILoginOptions;

}

interface ILoginOptions{

	url: string;

	[key: string] : string;
}

interface IConfigValidationResult{
	
	result: boolean;

	message: string;
}
