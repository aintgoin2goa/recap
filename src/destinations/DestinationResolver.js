(function (DestinationResolver) {
    function resolve(uri) {
        var moduleName = "./FileSystemDestination";

        var Destination = require(moduleName);
        var destination = new Destination(uri);
        return destination;
    }
    DestinationResolver.resolve = resolve;
})(exports.DestinationResolver || (exports.DestinationResolver = {}));
var DestinationResolver = exports.DestinationResolver;

//# sourceMappingURL=DestinationResolver.js.map
