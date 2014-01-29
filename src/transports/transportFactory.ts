
import FileSystemTransport = require("./FileSystemTransport");

function resolveTransport(uri: string): ITransport {
    return new FileSystemTransport(); 
}

function transport(from: ITempDir) {
    return {
        to: function (to: IDestination): Q.IPromise<boolean> {
            var transport = resolveTransport(to.uri);
            transport.from = from;
            transport.to = to;
            return transport.copyFiles();
        }
    }
}

export = transport;
