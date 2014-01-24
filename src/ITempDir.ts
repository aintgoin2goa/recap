/// <reference path="d/node.d.ts" />
/// <reference path = "d/Q.d.ts" />

interface ITempDir {

	ready: Q.IPromise<any>;

	dir : string;

    createRecord(url: string, width: number): string;

    createRecords(url: string, widths: number[]): void;

    saveRecords(): void;

    remove(): Q.IPromise<any>;

    listFiles(): string[];

}

interface ITempDirRecord {

    url: string;

    width: number;

    date: Date;

    filename: string;

}
