var FileSystemTransport = require("./transports/FileSystemTransport");
var DestinationType = require("./destinations/DestinationType");

function resolveTransport(type) {
    switch (type) {
        case DestinationType.FileSystem:
            return new FileSystemTransport();
    }
}

function transport(from) {
    console.log("transport from", from);
    return {
        to: function (to) {
            console.log("tranport to", to);
            var transport = resolveTransport(to.type);
            transport.from = from;
            transport.to = to;
            return transport.copyFiles();
        }
    };
}


module.exports = transport;

//# sourceMappingURL=transportFactory.js.map
