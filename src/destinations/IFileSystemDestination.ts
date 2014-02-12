interface IFileSystemDestination extends IDestination {

	dataFile: string;

    getFilename(tempName: string): string;

    isLocked(): boolean;

    lock(): Q.IPromise<any>;

    unlock(): void;

    updateData(data: ITempDirRecord[]): void;

    writeData(): Q.IPromise<any>;

    readData(): Q.IPromise<any>;

}