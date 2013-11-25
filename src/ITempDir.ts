/// <reference path="d/node.d.ts" />
/// <reference path = "d/Q.d.ts" />

interface ITempDir {

	ready: Q.IPromise<any>;

    createRecord(url: string, width: number): string;

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
