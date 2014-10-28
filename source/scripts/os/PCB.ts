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

module TSOS {

  export class PCB {
    //properties
    public pid;
    public base;
    public limit;
    public xRegister;
    public yRegister;
    public zRegister;
    public accumulator;
    public PC;
    public priority;
    //maybe add in the current State of the process
    //public State; //"new","ready","running","waiting", or "halted"

    constructor() {

    }

    public init(): void {
      this.base = 0;
      this.limit = 0;
      this.xRegister = 0;
      this.yRegister = 0;
      this.zRegister = 0;
      this.accumulator;
      this.PC = 0;
    }//end init

  }

}//end module
