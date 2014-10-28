///<reference path="../globals.ts" />
/* ------------
ProcessManager.ts
Manages different processes by creating PCBs
------------ */
var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            this.processes = [];
            this.init();
        }
        ProcessManager.prototype.init = function () {
            this.currentPid = -1;
        };

        ProcessManager.prototype.load = function (process) {
            this.currentPid++;
            this.processes[this.currentPid] = new TSOS.PCB();
            _MemoryManager.load(process, this.currentPid);
            return this.currentPid;
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
