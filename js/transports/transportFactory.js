var FileSystemTransport = require("./FileSystemTransport");
var DestinationType = require("../desintations/DestinationType");

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

