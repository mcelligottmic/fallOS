///<reference path="../globals.ts" />

/* ------------
     ProcessManager.ts

     Manages different processes by creating PCBs
     ------------ */

module TSOS {

  export class ProcessManager {
    //properties
    public currentPid: number;
    public processes = [];

    constructor() {
      this.init();
    }

    public init(): void {
      this.currentPid = -1;
    }//end init

    public load(process: string): number {
      this.currentPid++;
      this.processes[this.currentPid] = new PCB();
      _MemoryManager.load(process, this.currentPid);
      return this.currentPid;
    }

  }//end class

}//end module
