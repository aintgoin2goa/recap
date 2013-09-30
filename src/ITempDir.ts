/// <reference path="d/node.d.ts" />

interface ITempDir {

    createRecord(url: string, width: number): string;

    saveRecords(): void;

    remove(): void;

    listFiles(): string[];

}

interface ITempDirRecord {

    url: string;

    width: number;

    date: Date;

    filename: string;

}
