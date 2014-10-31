///<reference path="../globals.ts" />
/* ------------
PCB.ts
Requires global.ts.
Routines for the host RAM simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
------------ */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        //maybe add in the current State of the process
        //public State; //"new","ready","running","waiting", or "halted"
        function PCB() {
            this.base = "00";
            this.limit = "00";
            this.xRegister = "00";
            this.yRegister = "00";
            this.zRegister = "00";
            this.accumulator = "00";
            this.PC = "00";
        }
        PCB.prototype.init = function () {
            this.pid = "00";
            this.base = "00";
            this.limit = "00";
            this.xRegister = "00";
            this.yRegister = "00";
            this.zRegister = "00";
            this.accumulator = "00";
            this.PC = "00";
        };

        PCB.prototype.update = function () {
            this.xRegister = _CPU.Xreg;
            this.yRegister = _CPU.Yreg;
            this.zRegister = _CPU.Zflag;
            this.accumulator = _CPU.Acc;
            this.PC = _CPU.PC;
            //get the current state
            //this.isExecuting = true;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
