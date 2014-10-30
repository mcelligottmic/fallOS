///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (typeof PC === "undefined") { PC = "00"; }
            if (typeof Acc === "undefined") { Acc = "00"; }
            if (typeof Xreg === "undefined") { Xreg = "00"; }
            if (typeof Yreg === "undefined") { Yreg = "00"; }
            if (typeof Zflag === "undefined") { Zflag = "00"; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = "00", this.Acc = "00", this.Xreg = "00", this.Yreg = "00", this.Zflag = "00", this.isExecuting = false;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };

        //convert hex to memory location
        Cpu.prototype.memoryToInt = function (first, second) {
            return parseInt((second + first), 16);
        };

        //get element from memory given an address
        Cpu.prototype.dataAt = function (location) {
            //check to see if we are out of bounds with memory access
            return _MemoryManager.memory.RAM[location];
        };

        //store element to memory given an address and an element
        Cpu.prototype.storeAt = function (loaction, data) {
            //check to see if we have access
            _MemoryManager.memory.RAM[location] = data;
        };

        //Increase the PC by a set amount
        Cpu.prototype.addToPC = function (num) {
            this.PC = (parseInt(this.PC, 16) + num).toString(16);
        };

        //LDA A9
        //Load the accumulator with a constant
        Cpu.prototype.LDAc = function () {
            var constant = this.dataAt(parseInt(this.PC, 16) + 1);
            this.Acc = constant;
            this.addToPC(3);
        };

        //LDA AD
        //Load the accumulator from memory
        Cpu.prototype.LDAm = function () {
            var address = this.memoryToInt(this.dataAt(parseInt(this.PC, 16) + 1), this.dataAt(parseInt(this.PC, 16) + 2));
            var constant = this.dataAt(address);
            this.Acc = constant;
            this.addToPC(3);
        };

        //STA 8D
        //Store the accumulator in memory
        Cpu.prototype.STAm = function () {
            var address = this.memoryToInt(this.dataAt(parseInt(this.PC, 16) + 1), this.dataAt(parseInt(this.PC, 16) + 2));

            //store in memory
            this.storeAt(address, this.Acc);
            this.addToPC(3);
        };

        //ADC 6D
        //Add with carry
        //Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
        Cpu.prototype.ADC = function () {
            var value = this.memoryToInt(this.dataAt(parseInt(this.PC, 16) + 1), this.dataAt(parseInt(this.PC, 16) + 2));
            this.Acc = (parseInt(this.Acc, 16) + value).toString(16);
            this.addToPC(3);
        };

        //LDX A2
        //Load the X register with a constant
        Cpu.prototype.LDXc = function () {
            this.Xreg = this.dataAt(parseInt(this.PC, 16) + 1);
            this.addToPC(2);
        };

        //LDX AE
        //Load the X register from memory
        Cpu.prototype.LDXm = function () {
            this.Xreg = (this.memoryToInt(this.dataAt(parseInt(this.PC, 16) + 1), this.dataAt(parseInt(this.PC, 16) + 2))).toString(16);
            this.addToPC(3);
        };

        //LDY A0
        //Load the Y register from a constant
        Cpu.prototype.LDYc = function () {
            this.Yreg = this.dataAt(parseInt(this.PC, 16) + 1);
            this.addToPC(2);
        };

        //LDY AC
        //Load the Y register from memory
        Cpu.prototype.LDYm = function () {
            this.Yreg = (this.memoryToInt(this.dataAt(parseInt(this.PC, 16) + 1), this.dataAt(parseInt(this.PC, 16) + 2))).toString(16);
            this.addToPC(3);
        };

        //NOP EA
        //No Operation
        Cpu.prototype.NOP = function () {
            //...I know a guy who would be upset with the waste cycle
            this.addToPC(1);
        };

        //BRK 00
        //Break (which is really a system call)
        Cpu.prototype.BRK = function () {
            //figure out what to do here <----
            this.addToPC(1);
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
