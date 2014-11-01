///<reference path="../jquery.d.ts" />
var TSOS;
(function (TSOS) {
    var Display = (function () {
        function Display() {
        }
        //update Memory
        Display.prototype.updateRam = function (row, col, data) {
            //replace odd data with new
            var cellId = "r" + row + "c" + col;
            document.getElementById(cellId).innerHTML = data;
        };

        //update CPU
        Display.prototype.updateCPU = function () {
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
        };
        return Display;
    })();
    TSOS.Display = Display;
})(TSOS || (TSOS = {}));
