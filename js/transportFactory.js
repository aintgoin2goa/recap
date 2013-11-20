/// <reference path="destinations/DestinationType.ts" />
var FileSystemTransport = require("./transports/FileSystemTransport");
var DestinationType = require("./destinations/DestinationType");

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
