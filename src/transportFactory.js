/// <reference path="ITempDir.ts" />
/// <reference path="IDestDir.ts" />
/// <reference path="transports/ITransport.ts" />
/// <reference path="transports/FileSystemTransport.ts" />
/// <reference path="d/Q.d.ts" />
var FileSystemTransport = require("./transports/FileSystemTransport");

function resolveTransport(type) {
    switch (type) {
        case DestinationType.FileSystem:
            return new FileSystemTransport();
    }
}

function transport(from) {
    return {
        to: function (to) {
            var transport = resolveTransport(to.type);
            transport.from = from;
            transport.to = to;
            return transport.copyFiles();
        }
    };
}


module.exports = transport;

//# sourceMappingURL=transportFactory.js.map
