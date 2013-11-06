interface IFileSystemDestination extends IDestination {

    setup(): Q.IPromise<any>;

    getFilename(tempName: string): string;

    isLocked(): boolean;

    lock(): Q.IPromise<any>;

    unlock(): Q.IPromise<any>;

    updateData(data: ITempDirRecord[]): void;

    writeData(): Q.IPromise<any>;

}