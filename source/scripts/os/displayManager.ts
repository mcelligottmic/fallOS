///<reference path="jquery.d.ts" />

module TSOS {

  export class DisplayManager {

    //displays cpu, memory, and PCB
    public updateAll(): void {
      this.updateRam();
      this.updateCPU();
      this.updatePCB();
    }

    //update Memory
    public updateRam(): void {
      //get reference to table
      var table = $("#RAM");
      //clear all rows at once
      $("#RAM").empty();
      var colums = "<td>" + "Address" + "</td>";
      //add colums to row
      var row = "<tr>" + colums + "</tr>";
      //add row to table
      table.append(row);
      for (var i = 0; i < _MemoryManager.memory.max ; i+=8) {
        //create colums
        colums = "<td>" + "0x" + i.toString(16).toUpperCase() + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 0] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 1] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 2] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 3] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 4] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 5] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 6] + "</td>" +
                 "<td>" + _MemoryManager.memory.RAM[i + 7] + "</td>" ;
        //add colums to row
        row = "<tr>" + colums + "</tr>";
        //add row to table
        table.append(row);
      }//end loop
    }

    //update CPU
    public updateCPU(): void {
      //get reference to table
      var table = $("#CPUStatus");
      //clear all rows at once
      $("#CPUStatus").empty();
      var colums = "<td>" + "PC" + "</td>" +
                    "<td>" + "Acc" + "</td>" +
                    "<td>" + "Xreg" + "</td>" +
                    "<td>" + "Yreg" + "</td>" +
                    "<td>" + "Zflag" + "</td>";
      //add colums to row
      var row = "<tr>" + colums + "</tr>";
      //add row to table
      table.append(row);
      //create colums
      colums = "<td>" + _CPU.PC + "</td>" +
                    "<td>" + _CPU.Acc + "</td>" +
                    "<td>" + _CPU.Xreg + "</td>" +
                    "<td>" + _CPU.Yreg + "</td>" +
                    "<td>" + _CPU.Zflag + "</td>";
      //add colums to row
      row = "<tr>" + colums + "</tr>";
      //add row to table
      table.append(row);
    }

    //update PCB
    public updatePCB(): void {
      //get reference to table
      var table = $("#PCB");
      //clear all rows at once
      $("#PCB").empty();
      var colums = "<td>" + "PID" + "</td>" +
                  "<td>" + "PC" + "</td>" +
                  "<td>" + "Acc" + "</td>" +
                  "<td>" + "Xreg" + "</td>" +
                  "<td>" + "Yreg" + "</td>" +
                  "<td>" + "Zflag" + "</td>" +
                  "<td>" + "Base" + "</td>" +
                  "<td>" + "Limit" + "</td>" +
                  //"<td>" + "Priority" + "</td>" +
                  "<td>" + "State" + "</td>" ;
      //add colums to row
      var row = "<tr>" + colums + "</tr>";
      //add row to table
      table.append(row);
      //create colums
      colums = "<td>" + _CPU.currentProcess.pid + "</td>" +
              "<td>" + _CPU.currentProcess.PC + "</td>" +
              "<td>" + _CPU.currentProcess.Acc + "</td>" +
              "<td>" + _CPU.currentProcess.Xreg + "</td>" +
              "<td>" + _CPU.currentProcess.Yreg + "</td>" +
              "<td>" + _CPU.currentProcess.Zflag + "</td>" +
              "<td>" + _CPU.currentProcess.base + "</td>" +
              "<td>" + _CPU.currentProcess.limit + "</td>" +
              //"<td>" + _CPU.currentProcess.priority + "</td>" +
              "<td>" + _CPU.currentProcess.state + "</td>" ;
      //add colums to row
      row = "<tr>" + colums + "</tr>";
      //add row to table
      table.append(row);
      /*
      //loop through the ready queue if there is anything
      if (_CPUScheduler.readyQueue.getSize() != 0) {
        for (var i = 0; i < _CPUScheduler.readyQueue.getSize(); i++) {
          colums = "<td>" + _CPUScheduler.readyQueue[i].pid + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].PC + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].Acc + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].Xreg + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].Yreg + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].Zflag + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].base + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].limit + "</td>" +
                  //"<td>" + _CPU.currentProcess.priority + "</td>" +
                  "<td>" + _CPUScheduler.readyQueue[i].state + "</td>" ;
          //add colums to row
          row = "<tr>" + colums + "</tr>";
          //add row to table
          table.append(row);
          }//end loop
      }//end if
      */
    }

  }//end class

}//end module
