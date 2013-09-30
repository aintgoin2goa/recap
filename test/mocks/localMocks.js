exports.getTempDirMock = function(){

    return {

        createRecord: function () {

        },

        saveRecords: function () {

        },

        remove: function () {

        },

        listFiles: function () {

        }
    }
}

exports.getDestDirMock = function () {

    return {

        uri: function () {

        },

        type: function () {

        },

        getFilename: function (tempFile) {

        }
    }
}