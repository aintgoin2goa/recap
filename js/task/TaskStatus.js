var TaskStatus = (function () {
    function TaskStatus() {
    }
    TaskStatus.UNKNOWN = 0;

    TaskStatus.QUEUED = 1;

    TaskStatus.RUNNING = 2;

    TaskStatus.FAILED = 3;

    TaskStatus.COMPLETE = 4;
    return TaskStatus;
})();


module.exports = TaskStatus;

