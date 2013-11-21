interface IFileSystemDestination extends IDestination {

	dataFile: string;

    getFilename(tempName: string): string;

    isLocked(): boolean;

    lock(): Q.IPromise<any>;

    unlock(): Q.IPromise<any>;

    updateData(data: ITempDirRecord[]): void;

    writeData(): Q.IPromise<any>;

}