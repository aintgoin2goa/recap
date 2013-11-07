exports.getFSMock = function() {

    var existing = [];
    var fileCount = 0;
    var mockStream = exports.getMockStream();
    var files = [];
    var readFileData = "";

    return {
        addExisting: function(e) {
            existing.push(e);
        },

        reset: function() {
            existing = [];
            fileCount = 0;
        },

        setFileCount: function(c) {
            fileCount = c;
        },

        setMockstream: function(s) {
            mockStream = s;
        },

        setDirFiles: function(fls) {
            files = fls;
        },

        setReadFileData: function(d) {
            readFileData = d;
        },

        existsSync: function(filename) {
            return existing.indexOf(filename) > -1;
        },

        mkdir: function(name, mode, callback) {
            setTimeout(callback, 0);
        },

        mkdirSync: function() {

        },

        readdir: function(dir, cb) {
            var arr = [];
            arr.length = fileCount;
            setTimeout(function() {
                cb(null, arr);
            }, 0);
        },

        readFile: function(file, options, cb) {
            setTimeout(function() {
                cb(null, readFileData);
            }, 0);
        },

        writeFile: function(path, data, options, cb) {
            setTimeout(function() {
                cb(null);
            }, 0);
        },

        rmdir: function(dir, cb) {
            setTimeout(function() {
                cb(null);
            }, 0);
        },

        createWriteStream: function() {
            return mockStream;
        },

        createReadStream: function() {
            return mockStream;
        },

        unlink: function(file, cb) {
            setTimeout(function() {
                cb(null);
            }, 0);
        },

        readdirSync: function() {
            return files;
        },

        open: function (file, flags, mode, cb) {
            this.addExisting(file);
            setTimeout(function() {
                cb(null, 0);
            }, 0);
        }
    }
};

exports.getMockStream = (function () {

    var Stream = function () {
        this.handlers = {};
    }

    Stream.prototype.on = function (ev, cb) {
        if (!this.handlers[ev]) {
            this.handlers[ev] = [];
        }
        this.handlers[ev].push(cb);
    }

    Stream.prototype.pipe = function () { }

    Stream.prototype.fire = function(ev){
        if(!this.handlers[ev]){
            return;
        }

        this.handlers[ev].forEach(function (func) {
            func.call();
        });
    }

    return function () {
        return new Stream();
    }

}());