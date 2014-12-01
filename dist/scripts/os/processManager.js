///<reference path="../globals.ts" />
/* ------------
ProcessManager.ts
Manages different processes by creating PCBs
------------ */
var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            //list of all processes
            this.residentList = [];
            this.readyQueue = new TSOS.Queue();
            this.init();
        }
        ProcessManager.prototype.init = function () {
            this.currentPid = -1;
        };

        ProcessManager.prototype.load = function (process) {
            this.currentPid++;
            this.residentList[this.currentPid] = new TSOS.PCB();
            this.residentList[this.currentPid].pid = this.currentPid;
            _MemoryManager.load(process, this.currentPid);
            return this.currentPid;
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
