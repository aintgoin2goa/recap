/// <reference path="ITempDir.ts" />
/// <reference path="IDestDir.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="transports/FileSystemTransport.ts" />
/// <reference path="d/Q.d.ts" />

import FileSystemTransport = require("transports/FileSystemTransport");

function resolveTransport(type: DestinationType): ITransport {
    switch (type) {
        case DestinationType.FileSystem: 
            return new FileSystemTransport(); 
    }
}

function transport(from: ITempDir) {
    return {
        to: function (to: IDestDir): Q.IPromise<boolean> {
            var transport = resolveTransport(to.type);
            transport.from = from;
            transport.to = to;
            return transport.copyFiles();
        }
    }
}

export = transport;
