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
            this.MAXRAM = 256;
            this.BLOCKSIZE = 256;
            //need to figure out how to force integer division
            this.NUM_OF_BLOCKS = this.MAXRAM / this.BLOCKSIZE;
            this.init();
        }
        MemoryManager.prototype.init = function () {
            this.loadIndex = 0;
            this.lastLoad = 0;
            this.memory = new TSOS.mainMemory(256);
        };

        MemoryManager.prototype.load = function (program, pid) {
            //determine which blocks are open
            //determine how many blocks of memory we need
            this.loadIndex = 0; //update this when we have more blocks

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

            //store base and limit into PCB
            _ProcessManager.processes[pid].base = this.loadIndex;
            _ProcessManager.processes[pid].limit = this.loadIndex + this.BLOCKSIZE;
        };

        //fills main memory with 00 at each location
        MemoryManager.prototype.clear = function (base) {
            for (var i = base; i < this.memory.max; i++) {
                //RAM is an array of type string that will represent main memory
                this.memory.RAM[i] = "00";
            }
            this.lastLoad = base;
        };

        //check access to read from memory
        MemoryManager.prototype.read = function (location, pcb) {
            //check to see if we are out of bounds with memory access
            //check PCB for base and limit
            var base = pcb.base;
            var limit = pcb.limit;

            //if location is within base and limit
            if (location >= base && location < limit) {
                return this.memory.RAM[location];
            } else {
                //error
                _KernelInterruptQueue.enqueue(INVAILD_MEMORY_ACCESS_IRQ);
            }
        };

        //controll accress to write to memory
        MemoryManager.prototype.write = function (location, data, pcb) {
            //check to see if we are out of bounds with memory access
            //check PCB for base and limit
            var base = pcb.base;
            var limit = pcb.limit;

            //if location is within base and limit
            if (location >= base && location < limit) {
                this.memory.RAM[location] = data;
            } else {
                //error
                _KernelInterruptQueue.enqueue(INVAILD_MEMORY_ACCESS_IRQ);
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
