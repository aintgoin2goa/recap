require("colors");

interface IConsoleSettings {
    verbose: boolean;
    enabled: boolean;
}

var settings: IConsoleSettings = {
    verbose: false,
    enabled: false
}

var eventHandlers : {(type:string, content:any) : void}[];
eventHandlers = [];

export function on(handler){
    eventHandlers.push(handler);
}

function trigger(type:string, content:any){
    eventHandlers.forEach(function(handler){
        handler(type, content);
    });
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
   if (settings.enabled) {
        console.log(args.join(", " + "\r\n")[color]);
   }
}

export function info(...args: any[]): void {
    if (!settings.verbose) {
        return;
    }
    printToScreen(parseArgs(args), "white");   
}

export function warn(...args: any[]): void {
    trigger("warn", args);
    printToScreen(parseArgs(args), "yellow");
}

export function error(...args: any[]): void {
    trigger("error", args);
    printToScreen(parseArgs(args), "red");
}

export function success(...args: any[]): void {
    trigger("success", args);
    printToScreen(parseArgs(args), "green");
}

export function log(...args: any[]): void {
    trigger("log", args);
    info.apply(this, args);
}




