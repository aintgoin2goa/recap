

interface IConsole {

    setConfig<T>(name: string, value: T): void

    log(...args: any[]): void;

    warn(...args: any[]): void;

    error(...args: any[]): void;

    info(...args: any[]): void;

    success(...args: any[]): void;

}