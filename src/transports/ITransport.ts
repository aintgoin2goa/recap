/// <reference path="../IDestDir.ts" />
/// <reference path="../ITempDir.ts" />
/// <reference path="../d/Q.d.ts" />

interface ITransport {

    from: ITempDir;

    to: IDestDir;

    copyFiles(): Q.IPromise<boolean>;

}