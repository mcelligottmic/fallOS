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
            document.getElementById("PC").innerHTML = _CPU.PC;
            document.getElementById("Acc").innerHTML = _CPU.Acc;
            document.getElementById("Xreg").innerHTML = _CPU.Xreg;
            document.getElementById("Yreg").innerHTML = _CPU.Yreg;
            document.getElementById("Zreg").innerHTML = _CPU.Zflag;
        };
        return Display;
    })();
    TSOS.Display = Display;
})(TSOS || (TSOS = {}));
