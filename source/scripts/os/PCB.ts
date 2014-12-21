///<reference path="../globals.ts" />

/* ------------
     PCB.ts

     Requires global.ts.

     holds process information such as the process ID
     ------------ */

module TSOS {

  export class PCB {
    //properties
    public pid;
    public base;
    public limit;
    public Xreg;
    public Yreg;
    public Zflag;
    public Acc;
    public PC;
    public priority;
    //the current State of the process
    public state;

    constructor() {
      this.base = "00";
      this.limit = "00";
      this.Xreg = "00";
      this.Yreg = "00";
      this.Zflag = "00";
      this.Acc = "00";
      this.PC = "00";
      this.state = this.State.NEW;
    }

    public init(): void {
      this.pid = "00";
      this.base = "00";
      this.limit = "00";
      this.Xreg = "00";
      this.Yreg = "00";
      this.Zflag = "00";
      this.Acc = "00";
      this.PC = "00";
    }//end init

    public update(): void {
      this.Xreg = _CPU.Xreg;
      this.Yreg = _CPU.Yreg;
      this.Zflag = _CPU.Zflag;
      this.Acc = _CPU.Acc;
      this.PC = _CPU.PC;
      //get the current state
      //this.isExecuting = true;
    }

    // Enum that contains all possible states of a process
    public State = {
      NEW: 0,
      RUNNING: 1,
      WAITING: 2,
      READY: 3,
      TERMINATED: 4
    };

  }//end class

}//end module
