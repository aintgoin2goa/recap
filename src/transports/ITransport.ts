/// <reference path="../ITempDir.ts" />
/// <reference path="../d/Q.d.ts" />

interface ITransport {

    from: ITempDir;

    to: IDestination;

    copyFiles(): Q.IPromise<boolean>;

}