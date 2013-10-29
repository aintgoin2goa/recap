interface IFileSystemDestination extends IDestination {

    getFilename(tempName: string): string;

}