exports.getFSMock = function () {

    var existing = [];
    var fileCount = 0;
    var mockStream = exports.getMockStream();
    var files = [];

    return {

        addExisting : function(e){
            existing.push(e);
        },

        reset: function(){
            existing = [];
            fileCount = 0;
        },

        setFileCount: function(c){
            fileCount = c;
        },

        setMockstream: function(s){
            mockStream = s;
        },

        setDirFiles: function(fls){
            files = fls;
        },  

        existsSync : function(filename){
            return existing.indexOf(filename) > -1;
        },

        mkdirSync: function () {

        },

        writeFile: function () { },

        readdir: function (dir, cb) {
            var arr = [];
            arr.length = fileCount;
            setTimeout(function () {
                cb(null, arr);
            }, 0);
        },

        rmdir: function (dir, cb) {
            setTimeout(function () {
                cb(null);
            }, 0);
        },

        createWriteStream: function(){
            return mockStream;
        },

        createReadStream: function(){
            return mockStream;
        },

        unlink: function (file, cb) {
            setTimeout(function () {
                cb(null);
            }, 0);
        },

        readdirSync: function () {
            return files;
        }
    }
}

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