/* ------------
CPUScheduler.ts
handles how processes are sent to the CPU and when they are removed.
------------ */
var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler() {
            //properties
            this.readyQueue = new TSOS.Queue();
            this.init();
        }
        CPUScheduler.prototype.init = function () {
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
