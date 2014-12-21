///<reference path="../globals.ts" />
/* ------------
PCB.ts
Requires global.ts.
holds process information such as the process ID
------------ */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB() {
            // Enum that contains all possible states of a process
            this.State = {
                NEW: 0,
                RUNNING: 1,
                WAITING: 2,
                READY: 3,
                TERMINATED: 4
            };
            this.base = "00";
            this.limit = "00";
            this.Xreg = "00";
            this.Yreg = "00";
            this.Zflag = "00";
            this.Acc = "00";
            this.PC = "00";
            this.state = this.State.NEW;
        }
        PCB.prototype.init = function () {
            this.pid = "00";
            this.base = "00";
            this.limit = "00";
            this.Xreg = "00";
            this.Yreg = "00";
            this.Zflag = "00";
            this.Acc = "00";
            this.PC = "00";
        };

        PCB.prototype.update = function () {
            this.Xreg = _CPU.Xreg;
            this.Yreg = _CPU.Yreg;
            this.Zflag = _CPU.Zflag;
            this.Acc = _CPU.Acc;
            this.PC = _CPU.PC;
            //get the current state
            //this.isExecuting = true;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
