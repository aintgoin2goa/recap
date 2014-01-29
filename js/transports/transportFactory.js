var FileSystemTransport = require("./FileSystemTransport");

function resolveTransport(uri) {
    return new FileSystemTransport();
}

function transport(from) {
    return {
        to: function (to) {
            var transport = resolveTransport(to.uri);
            transport.from = from;
            transport.to = to;
            return transport.copyFiles();
        }
    };
}


module.exports = transport;

