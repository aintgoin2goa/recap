require("colors");

interface IConsoleSettings {
    verbose: boolean;
    enableForTests: boolean;
}

var settings: IConsoleSettings = {
    verbose: false,
    enableForTests: false
}

export function setConfig<T>(name: string, value: T): void {
    settings[name] = value;
}

function convertToString(obj: any): string {
    if (typeof obj == "string") {
        return obj;
    }
    if (obj instanceof Array) {
        return (<string[]>obj).join(", ");
    }
    if (typeof obj == "object") {
        return JSON.stringify(obj, null, 2);
    }
    return obj.toString();
}

function parseArgs(args: any[]): string[]{
    var parsedArgs: string[] = [];
    for (var i = 0, l = args.length; i < l; i++) {
        parsedArgs.push( convertToString(args[i]) );
    }
    return parsedArgs;
}

function printToScreen(args: string[], color: string): void {
    //if run tests test don't print anything
    if (process.argv.indexOf("node") != -1 && process.argv.indexOf("test/") != -1 && settings.enableForTests === false) {
        return;
    }

    console.log(args.join(", " + "\r\n")[color]);
}

export function info(...args: any[]): void {
    if (!settings.verbose) {
        return;
    }
    printToScreen(parseArgs(args), "white");   
}

export function warn(...args: any[]): void {
    printToScreen(parseArgs(args), "yellow");
}

export function error(...args: any[]): void {
    printToScreen(parseArgs(args), "red");
}

export function success(...args: any[]): void {
    printToScreen(parseArgs(args), "green");
}

export function log(...args: any[]): void {
    info.apply(this, args);
}



