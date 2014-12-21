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
            // Enum that contains all possible CPU scheduling algorithms
            this.Algorithm = {
                RR: 0,
                FCFS: 1,
                PRIORITY: 2
            };
            this.init();
        }
        CPUScheduler.prototype.init = function () {
            this.scheduling = this.Algorithm.RR;
            this.quantum = 6;
            this.cycle = 0;
        };
        return CPUScheduler;
    })();
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
