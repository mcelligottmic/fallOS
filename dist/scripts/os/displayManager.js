///<reference path="jquery.d.ts" />
var TSOS;
(function (TSOS) {
    var DisplayManager = (function () {
        function DisplayManager() {
        }
        //displays cpu, memory, and PCB
        DisplayManager.prototype.updateAll = function () {
            this.updateRam();
            this.updateCPU();
            this.updatePCB();
        };

        //update Memory
        DisplayManager.prototype.updateRam = function () {
            //get reference to table
            var table = $("#RAM");

            //clear all rows at once
            $("#RAM").empty();
            var colums = "<td>" + "Address" + "</td>";

            //add colums to row
            var row = "<tr>" + colums + "</tr>";

            //add row to table
            table.append(row);
            for (var i = 0; i < _MemoryManager.memory.max; i += 8) {
                //create colums
                colums = "<td>" + "0x" + i.toString(16).toUpperCase() + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 0] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 1] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 2] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 3] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 4] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 5] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 6] + "</td>" + "<td>" + _MemoryManager.memory.RAM[i + 7] + "</td>";

                //add colums to row
                row = "<tr>" + colums + "</tr>";

                //add row to table
                table.append(row);
            }
        };

        //update CPU
        DisplayManager.prototype.updateCPU = function () {
            //get reference to table
            var table = $("#CPUStatus");

            //clear all rows at once
            $("#CPUStatus").empty();
            var colums = "<td>" + "PC" + "</td>" + "<td>" + "Acc" + "</td>" + "<td>" + "Xreg" + "</td>" + "<td>" + "Yreg" + "</td>" + "<td>" + "Zflag" + "</td>";

            //add colums to row
            var row = "<tr>" + colums + "</tr>";

            //add row to table
            table.append(row);

            //create colums
            colums = "<td>" + _CPU.PC + "</td>" + "<td>" + _CPU.Acc + "</td>" + "<td>" + _CPU.Xreg + "</td>" + "<td>" + _CPU.Yreg + "</td>" + "<td>" + _CPU.Zflag + "</td>";

            //add colums to row
            row = "<tr>" + colums + "</tr>";

            //add row to table
            table.append(row);
        };

        //update PCB
        DisplayManager.prototype.updatePCB = function () {
            //get reference to table
            var table = $("#PCB");

            //clear all rows at once
            $("#PCB").empty();
            var colums = "<td>" + "PC" + "</td>" + "<td>" + "Acc" + "</td>" + "<td>" + "Xreg" + "</td>" + "<td>" + "Yreg" + "</td>" + "<td>" + "Zflag" + "</td>" + "<td>" + "PID" + "</td>" + "<td>" + "Base" + "</td>" + "<td>" + "Limit" + "</td>";

            //"<td>" + "Priority" + "</td>" +
            //"<td>" + "State" + "</td>" ;
            //add colums to row
            var row = "<tr>" + colums + "</tr>";

            //add row to table
            table.append(row);

            //create colums
            colums = "<td>" + _CPU.PC + "</td>" + "<td>" + _CPU.Acc + "</td>" + "<td>" + _CPU.Xreg + "</td>" + "<td>" + _CPU.Yreg + "</td>" + "<td>" + _CPU.Zflag + "</td>" + "<td>" + _CPU.currentProcess.pid + "</td>" + "<td>" + _CPU.currentProcess.base + "</td>" + "<td>" + _CPU.currentProcess.limit + "</td>";

            //"<td>" + _CPU.currentProcess.priority + "</td>" +
            //"<td>" + _CPU.currentProcess.state + "</td>" ;
            //add colums to row
            row = "<tr>" + colums + "</tr>";

            //add row to table
            table.append(row);
        };
        return DisplayManager;
    })();
    TSOS.DisplayManager = DisplayManager;
})(TSOS || (TSOS = {}));
