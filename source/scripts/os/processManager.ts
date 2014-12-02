///<reference path="../globals.ts" />

/* ------------
     ProcessManager.ts

     Manages different processes by creating PCBs
     ------------ */

module TSOS {

  export class ProcessManager {
    //properties
    public currentPid: number;
    //list of all processes
    public residentList = [];
    //public readyQueue = new Queue();

    constructor() {
      this.init();
    }

    public init(): void {
      this.currentPid = -1;
    }//end init

    public load(process: string): number {
      this.currentPid++;
      this.residentList[this.currentPid] = new PCB();
      this.residentList[this.currentPid].pid = this.currentPid;
      _MemoryManager.load(process, this.currentPid);
      this.residentList[this.currentPid].state =
                                this.residentList[this.currentPid].State.READY;
      return this.currentPid;
    }

  }//end class

}//end module
