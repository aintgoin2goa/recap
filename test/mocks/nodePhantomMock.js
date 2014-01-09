
exports.getMockPage = function () {
    return  {
        open: jasmine.createSpy("open").andCallFake(function (url, callback) {
            setTimeout(function () {
                callback(null, "success");
            }, 0);
        }),

        close: jasmine.createSpy("close").andCallFake(function(callback){
            setTimeout(function () {
                callback(null);
            }, 0);
        }),
        render: function(filename, callback){
            setTimeout(function () {
                callback(null);
            }, 0);
        },
        set: function(property, value, callback){
            setTimeout(function () {
                callback(null);
            }, 0);
        },
        evaluate: jasmine.createSpy("evaluateJavascript").andCallFake(function(script, callback){
            setTimeout(function () {
                callback(null);
            }, 0);
        })
    };
};

exports.getMockPhantom = function(mockPage){
    return  {
        createPage: function (callback) {
            setTimeout(function () {
                callback(null, mockPage);
            }, 0);
        },
        exit: function (callback) {
            setTimeout(function () {
                callback(null);
            }, 0);
        },
        on: function (event, callback) {
        }
    };
};

exports.getMockPhantomModule = function(mockPhantom){

    return {
        create: jasmine.createSpy("create").andCallFake(function (callback) {
            setTimeout(function () {
                callback(null, mockPhantom);
            }, 0);
        })
    };
};
