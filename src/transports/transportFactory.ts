/// <reference path="../destinations/DestinationType.ts" />

import FileSystemTransport = require("./FileSystemTransport");
var DestinationType: DestinationType = require("../desintations/DestinationType");

function resolveTransport(type: DestinationType): ITransport {
    switch (type) {
        case DestinationType.FileSystem: 
            return new FileSystemTransport(); 
    }
}

function transport(from: ITempDir) {
    return {
        to: function (to: IDestination): Q.IPromise<boolean> {
            var transport = resolveTransport(to.type);
            transport.from = from;
            transport.to = to;
            return transport.copyFiles();
        }
    }
}

export = transport;
