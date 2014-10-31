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
            //  var table = <HTMLTable> document.getElementById("CPUStatus");
            //table.rows[0].deleteCell(0);
            document.getElementById("PC").childNodes[0] = document.createTextNode(_CPU.PC);
            document.getElementById("Acc").childNodes[0] = document.createTextNode(_CPU.Acc);
            document.getElementById("Xreg").childNodes[0] = document.createTextNode(_CPU.Xreg);
            document.getElementById("Yreg").childNodes[0] = document.createTextNode(_CPU.Yreg);
            document.getElementById("Zreg").childNodes[0] = document.createTextNode(_CPU.Zflag);
        };
        return Display;
    })();
    TSOS.Display = Display;
})(TSOS || (TSOS = {}));
