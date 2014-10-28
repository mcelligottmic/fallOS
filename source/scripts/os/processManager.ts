///<reference path="../globals.ts" />

/* ------------
     ProcessManager.ts

     Manages different processes by creating PCBs
     ------------ */

module TSOS {

  export class ProcessManager {
    //properties
    public currentPID: number;
    public processes = [];

    constructor() {
      this.init();
    }

    public init(): void {
      this.currentPID = -1;
    }//end init

    public load(process: string): number {
      this.currentPID++;
      this.processes[this.currentPID] = new PCB();
      _MemoryManager.load(process, this.currentPID);
      return this.currentPID;
    }

  }//end class

}//end module
