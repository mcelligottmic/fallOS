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

        //gets the next byte and returns its Int value
        Cpu.prototype.getNextByte = function () {
            this.addToPC(1);
            return parseInt(this.dataAt(parseInt(this.PC, 16)), 16);
        };

        //gets the next two memory locations and returns the equivalent int
        Cpu.prototype.getNextAddress = function () {
            var location1 = this.getNextByte().toString(16);
            var location2 = this.getNextByte().toString(16);
            return parseInt((location2 + location1), 16);
        };

        //LDA A9
        //Load the accumulator with a constant
        Cpu.prototype.LDAc = function () {
            var constant = this.getNextByte().toString(16);
            this.Acc = constant;
            this.addToPC(1);
        };

        //LDA AD
        //Load the accumulator from memory
        Cpu.prototype.LDAm = function () {
            var address = this.getNextAddress();
            this.Acc = this.dataAt(address);
            this.addToPC(1);
        };

        //STA 8D
        //Store the accumulator in memory
        Cpu.prototype.STAm = function () {
            var address = this.getNextAddress();

            //store in memory
            this.storeAt(address, this.Acc);
            this.addToPC(1);
        };

        //ADC 6D
        //Add with carry
        //Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
        Cpu.prototype.ADC = function () {
            var address = this.getNextAddress();
            var value = parseInt(this.dataAt(address), 16);
            this.Acc = (parseInt(this.Acc, 16) + value).toString(16);
            this.addToPC(1);
        };

        //LDX A2
        //Load the X register with a constant
        Cpu.prototype.LDXc = function () {
            this.Xreg = this.getNextByte().toString(16);
            this.addToPC(1);
        };

        //LDX AE
        //Load the X register from memory
        Cpu.prototype.LDXm = function () {
            this.Xreg = this.getNextAddress().toString(16);
            this.addToPC(3);
        };

        //LDY A0
        //Load the Y register from a constant
        Cpu.prototype.LDYc = function () {
            this.Yreg = this.getNextByte().toString(16);
            this.addToPC(1);
        };

        //LDY AC
        //Load the Y register from memory
        Cpu.prototype.LDYm = function () {
            this.Yreg = this.getNextAddress().toString(16);
            this.addToPC(1);
        };

        //NOP EA
        //No Operation
        Cpu.prototype.NOP = function () {
            //...I know a guy who would be upset with the wasted cycle
            this.addToPC(1);
        };

        //BRK 00
        //Break (which is really a system call)
        Cpu.prototype.BRK = function () {
            //figure out what to do here <----
            this.addToPC(1);
        };

        Cpu.prototype.CPX = function () {
            var address = this.getNextAddress();
            var value = parseInt(this.dataAt(address), 16);
            if (value == parseInt(this.Xreg)) {
                this.Zflag = "00";
            }
            this.addToPC(1);
        };

        //BNE D0
        //Branch n bytes if Z flag = 0
        Cpu.prototype.BNE = function () {
            if (this.Zflag == "00") {
                //branch
                this.addToPC(parseInt(this.dataAt(parseInt(this.PC, 16))));
            }
            this.addToPC(1);
        };

        //INC EE
        //Increment the value of a byte
        Cpu.prototype.INC = function () {
            var address = this.getNextAddress();
            this.storeAt(address, (parseInt(this.dataAt(address)) + 1).toString(16));
            this.addToPC(1);
        };

        //SYS FF
        //System Call
        Cpu.prototype.SYS = function () {
            //gotta read up on this
            //_KernelInterruptQueue.enqueue(new Interrupt())
            this.addToPC(1);
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
