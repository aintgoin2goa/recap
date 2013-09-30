

enum DestinationType {
    FileSystem
}

interface IDestDir {

    uri: string;

    type: DestinationType;

    getFilename(tempFile: string): string;

}