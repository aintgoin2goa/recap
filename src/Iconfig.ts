interface IConfig{

    urls: {[url: string] : IUrlOptions}

    widths: number[];

    dest : string;

    options : IUrlOptions;

    settings: IConfigSettings

}

interface IUrlOptions {

    waitTime?: number;

    crawl?: boolean;

    script? : string;

    [url: string] : IUrlOptions;

}

interface IConfigValidationResult{
	
	result: boolean;

	message: string;
}

interface IConfigSettings{

    maxInstances : number;

    template : string;

}
