
var sinon = require("sinon");

var page = {
    open: function(url, callback){
        callback(null);
    },
    close: function(callback){
        callback()
    },
    render: function(filename, callback){
        callback(null);
    },
    set: function(property, value, callback){
        callback(null);
    }
}

var MockPage = sinon.mock(page);

var handlers = {};

var phantom = {
    createPage: function (callback) {
        callback(null, MockPage);
    },
    exit: function (callback) {
        callback();
    },
    on: function (event, callback) {
        if (!handlers[event]) {
            handlers[event] = [];
        }
        handlers[event].push(callback);
    }
}

var MockPhantom = sinon.mock(phantom);

var phantomModule = {
    create: function (callback) {
        callback(MockPhantom);
    }
}

module.exports = {
    MockPhantomModule: phantomModule,
    MockPhantom: MockPhantom,
    MockPage: MockPage
}
