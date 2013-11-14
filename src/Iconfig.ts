interface IConfig{

    urls: string[];

    widths: number[];

    dest: string;

    options: IConfigOptions;

}

interface IConfigOptions {

    waitTime: number;

}
