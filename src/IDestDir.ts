/// <reference path="IDestinationType.ts" />   

interface IDestDir {

    uri: string;

    type: DestinationType;

    getFilename(tempFile: string): string;

}

