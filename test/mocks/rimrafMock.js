module.exports = jasmine.createSpy("RimRafMock").andCallFake(function(dir, cb) {
    setTimeout(function() {
        cb(null);
    }, 0);
});