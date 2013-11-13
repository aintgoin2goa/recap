var Q = require('q');

exports.getTempDirMock = function() {

    return {
        createRecord: function() {

        },

        saveRecords: function() {

        },

        remove: function() {

        },

        listFiles: function() {

        }
    };
};

exports.getDestDirMock = function () {

    var isLocked = false;
    var isLockedCount = 0;
    var isLockedMax = 0;

    var callTracker = {
        isLocked: [],
        lock: [],
        unlock: [],
        getFilename: []
    };

    var filename;


    return {
        setIsLocked: function(v,c) {
            isLocked = v;
            isLockedMax = c;
        },
        
        reset: function() {
            isLockedCount = 0;
            for (var f in callTracker) {
                callTracker[f] = [];
            }
        },
        
        lastInvocationOf: function(fn) {
            if (callTracker[fn] && callTracker[fn].length) {
                var c = callTracker[fn];
                return c[c.length - 1];
            }
        },
        
        firstInvocationOf: function (fn) {
            if (callTracker[fn] && callTracker[fn].length) {
                return callTracker[fn][0];
            }
        },

        uri: function() {

        },

        type: function() {

        },
        
        setFilename: function(f) {
            filename = f;
        },

        getFilename: (function () {
            return jasmine.createSpy("getFilename").andCallFake(function (tempFile) {
                setImmediate(function() {
                    callTracker.getFilename.push(new Date().getTime());
                });
                return filename;
            });
        }()),

        isLocked: (function() {
            return jasmine.createSpy("isLocked").andCallFake(function () {
                callTracker.isLocked.push(new Date().getTime());
                var result = isLockedCount >= isLockedMax ? false : isLocked;
                isLockedCount++;
                return result;
            });
        }()),
        
        lock: (function () {
            return jasmine.createSpy("lock").andCallFake(function () {
                callTracker.lock.push(new Date().getTime());
                var dfd = Q.defer();
                setImmediate(function () {
                    dfd.resolve();
                });
                return dfd.promise;
            });
        }()),

        unlock: (function() {
            return jasmine.createSpy("unlock").andCallFake(function () {
                callTracker.unlock.push(new Date().getTime());
                var dfd = Q.defer();
                setImmediate(function() {
                    dfd.resolve();
                });
                return dfd.promise;
            });
        }()),
    };
}