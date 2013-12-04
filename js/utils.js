exports.object = {
    clone: function clone(obj) {
        var keys = Object.keys(obj);
        var newObj = Object.create(Object.getPrototypeOf(obj));
        for (var i = keys.length; i >= 0; i--) {
            newObj[keys[i]] = obj[keys[i]];
        }
        return newObj;
    },
    merge: function merge(obj1, obj2) {
        var mergedObj = exports.object.clone(obj1);
        var keys = Object.keys(obj2);
        for (var i = keys.length; i >= 0; i--) {
            if (!mergedObj[keys[i]]) {
                mergedObj[keys[i]] = obj2[keys[i]];
            }
        }
        return mergedObj;
    }
};

//# sourceMappingURL=utils.js.map
