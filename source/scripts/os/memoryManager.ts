/* ------------
     MemoryManager.ts

     Requires globals.ts

     Routines for the Operating System, NOT the host.
     ------------ */

module TSOS {

    export class MemoryManager {
      //properties
      public MAXRAM = 256;
      public BLOCKSIZE = 256;
      //need to figure out how to force integer division
      public NUM_OF_BLOCKS = this.MAXRAM / this.BLOCKSIZE;
      public loadIndex;
      public lastLoad;
      public memory;

      constructor() {
        this.init();
      }

      public init(): void {
        this.loadIndex = 0;
        this.lastLoad = 0;
        this.memory = new mainMemory(256);
      }//end init

      public load( program : string, PID : number): void {
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
      //store base and limit into PCB
      _ProcessManager.processes[PID].base = this.loadIndex;
      _ProcessManager.processes[PID].limit = this.loadIndex + this.BLOCKSIZE;
      }

      //fills main memory with 00 at each location
      public clear( base: number ): void {
        for (var i = base; i < this.memory.max; i++){
          //RAM is an array of type string that will represent main memory
          this.memory.RAM[i] = "00";
        }
      this.lastLoad = base;
      }//end method

    }
  }
