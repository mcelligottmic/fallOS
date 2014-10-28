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
            this.currentPID = -1;
        };

        ProcessManager.prototype.load = function (process) {
            this.currentPID++;
            this.processes[this.currentPID] = new TSOS.PCB();
            _MemoryManager.load(process, this.currentPID);
            return this.currentPID;
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
