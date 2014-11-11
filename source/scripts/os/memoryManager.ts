/* ------------
     MemoryManager.ts

     Requires globals.ts

     Routines for the Operating System, NOT the host.
     ------------ */

module TSOS {

    export class MemoryManager {
      //properties
      public BLOCKSIZE = 256;
      public MAXRAM = this.BLOCKSIZE;
      //need to figure out how to force integer division
      public NUM_OF_BLOCKS = this.MAXRAM / this.BLOCKSIZE;
      //used to find where to start loading
      public loadIndex;
      //the last position filled
      public lastLoad;
      public memory;
      //true if block is ready for use
      public freeSpace = [];

      constructor() {
        this.init();
      }

      public init(): void {
        this.loadIndex = 0;
        this.lastLoad = 0;
        this.memory = new mainMemory(this.MAXRAM);
        this.freeSpace[0] = true;
        this.freeSpace[1] = true;
        this.freeSpace[2] = true;
      }//end init

      public load( program : string, pid : number): void {
        //determine which blocks are open

        //determine how many blocks of memory we need
        this.loadIndex = 0; //update this when we have more blocks
        //clear the block we are going to use
        this.clear(this.loadIndex);
        var data;
        //load program at base
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
      _ProcessManager.processes[pid].accumulator = "0";
      _ProcessManager.processes[pid].PC = this.loadIndex.toString(16);
      this.freeSpace[pid] = false;
      //update display
      _DisplayManager.updateRam();
      }

      //fills block of memory with 00 at each location
      public clear( base: number ): void {
        for (var i = base; i < this.memory.max; i++){
          //RAM is an array of type string that will represent main memory
          this.memory.RAM[i] = "00";
        }
      this.lastLoad = base;
      }//end method

      //check access to read from memory
      public read(location: number, pcb: PCB): string {
        //check to see if we are out of bounds with memory access
        //check PCB for base and limit
        var base = parseInt(pcb.base, 16);
        var limit = parseInt(pcb.limit, 16);
        //if location is within base and limit
        if (location >= base && location < limit) {
          return this.memory.RAM[location];
        } else {
          //error
          _KernelInterruptQueue.enqueue(new Interrupt(INVAILD_MEMORY_ACCESS_IRQ, []));
        }
      }

      //controll accress to write to memory
      public write(location: number, data: string, pcb: PCB ): void {
        //check to see if we are out of bounds with memory access
        //check PCB for base and limit
        var base = parseInt(pcb.base, 16);
        var limit = parseInt(pcb.limit, 16);
        //if location is within base and limit
        if (location >= base && location < limit) {
          this.memory.RAM[location] = data;
        } else {
          //error
          _KernelInterruptQueue.enqueue(new Interrupt(INVAILD_MEMORY_ACCESS_IRQ, []));
        }
      }

    }
  }
