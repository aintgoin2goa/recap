
var rimraf = jasmine.createSpy("RimRafMock").andCallFake(function(dir, cb) {
    setTimeout(function() {
        cb(null);
    }, 0);
});

rimraf.sync = jasmine.createSpy("RimRafSyncMock");

module.exports = rimraf;
