/* ------------
MemoryManager.ts
Requires globals.ts
Routines for the Operating System, NOT the host.
------------ */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            //properties
            this.BLOCKSIZE = 256;
            this.MAXRAM = _MAXRAM;
            //need to figure out how to force integer division
            this.NUM_OF_BLOCKS = this.MAXRAM / this.BLOCKSIZE;
            //true if block is ready for use
            this.freeSpace = [];
            this.init();
        }
        MemoryManager.prototype.init = function () {
            this.loadIndex = 0;
            this.lastLoad = 0;
            this.memory = new TSOS.mainMemory();
            this.freeSpace[0] = true;
            this.freeSpace[1] = true;
            this.freeSpace[2] = true;
        };

        MemoryManager.prototype.load = function (program, pid) {
            //determine which blocks are open
            //determine how many blocks of memory we need
            //update, as of now each program can only be of size 256
            this.loadIndex = (pid % 3) * 256;

            //clear the block we are going to use
            this.clear(this.loadIndex);
            var data;

            for (var i = 0; i < program.length; i = i + 2) {
                //RAM is an array of type string that will represent main memory
                data = program.charAt(i);
                if (program.length - i > 1) {
                    data = program.charAt(i) + program.charAt(i + 1);
                }
                this.memory.RAM[this.lastLoad] = data;
                this.lastLoad++;
            }

            //store info into PCB
            _ProcessManager.processes[pid].base = this.loadIndex.toString(16);
            _ProcessManager.processes[pid].limit = (this.loadIndex + this.BLOCKSIZE).toString(16);
            _ProcessManager.processes[pid].xRegister = "00";
            _ProcessManager.processes[pid].yRegister = "00";
            _ProcessManager.processes[pid].zRegister = "00";
            _ProcessManager.processes[pid].accumulator = "00";
            _ProcessManager.processes[pid].PC = this.loadIndex.toString(16);
            this.freeSpace[pid % 3] = false;

            //update display
            _DisplayManager.updateRam();
        };

        //fills block of memory with 00 at each location
        MemoryManager.prototype.clear = function (base) {
            for (var i = 0; i < this.BLOCKSIZE; i++) {
                //RAM is an array of type string that will represent main memory
                this.memory.RAM[i + base] = "00";
            }
            this.freeSpace[base % 256] = true;
            this.lastLoad = base;
        };

        //clear all memory
        MemoryManager.prototype.clearMem = function () {
            this.memory.init();
            _DisplayManager.updateRam();
        };

        //check access to read from memory
        MemoryManager.prototype.read = function (location, pcb) {
            //check to see if we are out of bounds with memory access
            //check PCB for base and limit
            var base = parseInt(pcb.base, 16);
            var limit = parseInt(pcb.limit, 16);

            //add offset
            location = (location % this.BLOCKSIZE) + base;

            //if location is within base and limit
            if (location >= base && location < limit) {
                return this.memory.RAM[location];
            } else {
                //error
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(INVAILD_MEMORY_ACCESS_IRQ, []));
            }
        };

        //controll accress to write to memory
        MemoryManager.prototype.write = function (location, data, pcb) {
            //check to see if we are out of bounds with memory access
            //check PCB for base and limit
            var base = parseInt(pcb.base, 16);
            var limit = parseInt(pcb.limit, 16);

            //add offset
            location = (location % this.BLOCKSIZE) + base;

            //if location is within base and limit
            if (location >= base && location < limit) {
                this.memory.RAM[location] = data;
            } else {
                //error
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(INVAILD_MEMORY_ACCESS_IRQ, []));
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
