/* ------------
     CPUScheduler.ts

     handles how processes are sent to the CPU and when they are removed.
     ------------ */

module TSOS {

    export class CPUScheduler {
      //properties
      public readyQueue = new Queue();
      public quantum: number;
      public scheduling;
      public cycle: number;

      constructor() {
        this.init();
      }

      public init(): void {
        this.scheduling = this.Algorithm.RR;
        this.quantum = 6;
        this.cycle = 0;
      }//end init

      // Enum that contains all possible CPU scheduling algorithms
      Algorithm = {
        RR: 0, //Round Robin
        FCFS: 1, //First Come First Serve
        PRIORITY: 2,
      };

    }//end class

  }//end module
