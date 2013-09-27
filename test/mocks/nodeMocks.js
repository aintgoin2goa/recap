exports.getFSMock = function () {

    var existing = [];
    var fileCount = 0;

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
        }


    }

}