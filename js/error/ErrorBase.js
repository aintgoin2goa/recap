var ErrorBase = (function () {
    function ErrorBase(message) {
        this.name = "Error";
        this.message = message;
    }
    return ErrorBase;
})();


module.exports = ErrorBase;

