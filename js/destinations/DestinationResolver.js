var DestinationResolver;
(function (DestinationResolver) {
    function resolve(uri) {
        var moduleName = "./FileSystemDestination";

        var Destination = require(moduleName);
        var destination = new Destination(uri);
        return destination;
    }
    DestinationResolver.resolve = resolve;
})(DestinationResolver || (DestinationResolver = {}));


module.exports = DestinationResolver;

