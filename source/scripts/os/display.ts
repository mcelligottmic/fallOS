///<reference path="../jquery.d.ts" />

module TSOS {

  export class Display {

    //update Memory
    public updateRam(row, col, data): void {
      //replace odd data with new
      var cellId = "r" + row + "c" + col;
      document.getElementById(cellId).innerHTML = data;
    }

    //update CPU
    public updateCPU(): void {

      /*
      var table = <HTMLTableElement> document.getElementById("CPUStatus");
      table.deleteRow(0);
      var row  = <HTMLTableRowElement> table.insertRow(1);
      var cell = row.insertCell(0);
      //var text = document.createTextNode(_CPU.PC);
      var text = document.createTextNode("Registers");
      cell.appendChild(text);

      document.getElementById("PC").childNodes[0] = document.createTextNode(_CPU.PC);
      document.getElementById("Acc").childNodes[0] = document.createTextNode(_CPU.Acc);
      document.getElementById("Xreg").childNodes[0] = document.createTextNode(_CPU.Xreg);
      document.getElementById("Yreg").childNodes[0] = document.createTextNode(_CPU.Yreg);
      document.getElementById("Zreg").childNodes[0] = document.createTextNode(_CPU.Zflag);
      */
    }

    //update PCB
    //public updatePCB(): void {
      //document.getElementById("PID").innerHTML = _CPU.PC;
      //document.getElementById("BASE").innerHTML = _CPU.Acc;
      //document.getElementById("LIMIT").innerHTML = _CPU.Acc;
      //document.getElementById("Xreg").innerHTML = _CPU.Xreg;
      ///document.getElementById("Yreg").innerHTML = _CPU.Yreg;
      ///document.getElementById("Zreg").innerHTML = _CPU.Zflag;
      //document.getElementById("Acc").innerHTML = _CPU.Xreg;
      ///document.getElementById("PC").innerHTML = _CPU.Yreg;
      //document.getElementById("Priority").innerHTML = _CPU.Zflag;
    //}

  }//end class

}//end module
