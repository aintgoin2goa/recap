/// <reference path="IDestination.ts" />
/// <reference path="IDestinationType.ts" />

import path = require("path");
import fs = require("fs");
var DestinationType: DestinationType = require("./DestinationType");

class FileSystemDestination implements IDestination {

    public uri: string;

    public type: DestinationType;

    constructor(uri: string) {
        this.uri = uri;
        this.type = this.getType(uri);
        if (!fs.existsSync(uri)) {
            fs.mkdirSync(uri);
        }
    }

    getFilename(tempName: string): string {
        var name = tempName.split(path.sep).pop();
        return this.uri + path.sep + name;
    }

    private getType(uri: string): DestinationType {
        // only one type right now
        return DestinationType.FileSystem;
    }

}

export = FileSystemDestination;
