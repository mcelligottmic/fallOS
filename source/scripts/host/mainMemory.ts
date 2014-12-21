///<reference path="../globals.ts" />

/* ------------
     mainMemory.ts

     Requires global.ts.

     Routines for the host RAM simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.
     ------------ */

module TSOS {

  export class mainMemory {
    //properties
    //main memory will be stored in bytes
    public RAM = [];
    public max = _MAXRAM;

    constructor() {
      this.init();
    }

    //fills main memory with 00 at each location
    public init(): void {
      for (var i = 0; i < this.max; i++){
        //RAM is an array of type string that will represent main memory
        this.RAM[i] = "00";
      }
    }//end init

  }

}//end module
