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
        function Cpu(currentProcess, PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (typeof currentProcess === "undefined") { currentProcess = null; }
            if (typeof PC === "undefined") { PC = "00"; }
            if (typeof Acc === "undefined") { Acc = "00"; }
            if (typeof Xreg === "undefined") { Xreg = "00"; }
            if (typeof Yreg === "undefined") { Yreg = "00"; }
            if (typeof Zflag === "undefined") { Zflag = "00"; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.currentProcess = currentProcess;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.currentProcess = null, this.PC = "00", this.Acc = "00", this.Xreg = "00", this.Yreg = "00", this.Zflag = "00", this.isExecuting = false;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //get next instruction
            var instruction = this.getNextByte();
            switch (instruction) {
                case "A9":
                    this.LDAc();
                    break;
                case "AD":
                    this.LDAm();
                    break;
                case "8D":
                    this.STA();
                    break;
                case "6D":
                    this.ADC();
                    break;
                case "A2":
                    this.LDXc();
                    break;
                case "AE":
                    this.LDXm();
                    break;
                case "A0":
                    this.LDYc();
                    break;
                case "AC":
                    this.LDYm();
                    break;
                case "EA":
                    this.NOP();
                    break;
                case "00":
                    this.BRK();
                    break;
                case "EC":
                    this.CPX();
                    break;
                case "D0":
                    this.BNE();
                    break;
                case "EE":
                    this.INC();
                    break;
                case "FF":
                    this.SYS();
                    break;
            }

            //update the PCB
            this.currentProcess.update();
        };

        //CPU starts working on a process
        Cpu.prototype.start = function (pcb) {
            this.currentProcess = pcb;
            this.PC = pcb.PC, this.Acc = pcb.accumulator, this.Xreg = pcb.xRegister, this.Yreg = pcb.yRegister, this.Zflag = pcb.zRegister, this.isExecuting = true;
        };

        //CPU stops working on a process
        Cpu.prototype.stop = function () {
            this.init();
        };

        //get element from memory given an address
        Cpu.prototype.dataAt = function (location) {
            return _MemoryManager.read(location, this.currentProcess);
        };

        //store element to memory given an address and an element
        Cpu.prototype.storeAt = function (location, data) {
            //check to see if we have access
            _MemoryManager.write(location, data, this.currentProcess);
        };

        //Increase the PC by a set amount
        Cpu.prototype.addToPC = function (num) {
            this.PC = ((parseInt(this.PC, 16) + num) % _MemoryManager.BLOCKSIZE).toString(16).toUpperCase();
        };

        //gets the next byte and returns it as a string
        Cpu.prototype.getNextByte = function () {
            var byte = this.dataAt(parseInt(this.PC, 16));
            this.addToPC(1);
            return byte.toUpperCase();
        };

        //converts a byte to an Int
        Cpu.prototype.byteToInt = function (byte) {
            return parseInt(byte, 16);
        };

        //gets the next two memory locations and returns the equivalent int
        Cpu.prototype.getNextAddress = function () {
            var location1 = this.getNextByte();
            var location2 = this.getNextByte();
            return parseInt((location2 + location1), 16);
        };

        //LDA A9
        //Load the accumulator with a constant
        Cpu.prototype.LDAc = function () {
            var constant = this.getNextByte();
            this.Acc = constant;
        };

        //LDA AD
        //Load the accumulator from memory
        Cpu.prototype.LDAm = function () {
            var address = this.getNextAddress();
            this.Acc = this.dataAt(address);
        };

        //STA 8D
        //Store the accumulator in memory
        Cpu.prototype.STA = function () {
            var address = this.getNextAddress();

            //store in memory
            this.storeAt(address, this.Acc);
        };

        //ADC 6D
        //Add with carry
        //Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
        Cpu.prototype.ADC = function () {
            var address = this.getNextAddress();
            var value = parseInt(this.dataAt(address), 16);
            this.Acc = (parseInt(this.Acc, 16) + value).toString(16).toUpperCase();
        };

        //LDX A2
        //Load the X register with a constant
        Cpu.prototype.LDXc = function () {
            this.Xreg = this.getNextByte();
        };

        //LDX AE
        //Load the X register from memory
        Cpu.prototype.LDXm = function () {
            this.Xreg = parseInt(this.dataAt(this.getNextAddress()), 16).toString(16).toUpperCase();
        };

        //LDY A0
        //Load the Y register from a constant
        Cpu.prototype.LDYc = function () {
            this.Yreg = this.getNextByte();
        };

        //LDY AC
        //Load the Y register from memory
        Cpu.prototype.LDYm = function () {
            this.Yreg = parseInt(this.dataAt(this.getNextAddress()), 16).toString(16).toUpperCase();
        };

        //NOP EA
        //No Operation
        Cpu.prototype.NOP = function () {
            //...I know a guy who would be upset with the wasted cycle
        };

        //BRK 00
        //Break (which is really a system call)
        Cpu.prototype.BRK = function () {
            //Exit the process
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CPU_BREAK_IRQ, []));
        };

        Cpu.prototype.CPX = function () {
            var address = this.getNextAddress();
            var value = parseInt(this.dataAt(address), 16);
            if (value == parseInt(this.Xreg)) {
                this.Zflag = "01";
            } else {
                this.Zflag = "00";
            }
        };

        //BNE D0
        //Branch n bytes if Z flag = 0
        Cpu.prototype.BNE = function () {
            if (this.Zflag == "00") {
                //branch
                this.addToPC(parseInt(this.dataAt(parseInt(this.PC, 16)), 16));
            }
            this.addToPC(1);
        };

        //INC EE
        //Increment the value of a byte
        Cpu.prototype.INC = function () {
            var address = this.getNextAddress();
            this.storeAt(address, (parseInt(this.dataAt(address), 16) + 1).toString(16).toUpperCase());
        };

        //SYS FF
        //System Call
        Cpu.prototype.SYS = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SYSTEM_CALL_IRQ, [this.Xreg, this.Yreg, this.currentProcess]));
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
