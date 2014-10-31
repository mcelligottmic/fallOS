var TSOS;
(function (TSOS) {
    var SystemCallLibrary = (function () {
        function SystemCallLibrary() {
        }
        SystemCallLibrary.prototype.krnBreak = function (params) {
            //save all data on cpu to the process control block
            //_CPU.currentProcess.update();
            //end the process
            _MemoryManager.freeSpace[_CPU.currentProcess.pid] = true;
            _StdOut.putText("Process ID: " + _CPU.currentProcess.pid + " complete");
            _CPU.stop();
            //_CPU.currentProcess.state = halted or terminated?
            //TODO context switching for project 3
        };

        SystemCallLibrary.prototype.krnSysCall = function (params) {
            //if 1 in Xreg print y
            if (_CPU.Xreg = "01") {
                _StdOut.putText(_CPU.Yreg);
                //if 2 print string starting at location yReg and ending at 00
            } else if (_CPU.Xreg = "02") {
                var byte = _MemoryManager.read(_CPU.byteToInt(_CPU.Yreg), _CPU.currentProcess);
                var string = "";
                while (byte != "00") {
                    string = string + byte;
                }
                _StdOut.putText(string);
            } else {
                //blue screen of death
                _StdOut.putText("INVALID PARAMETER FOR SYSTEM CALL");
            }
        };
        return SystemCallLibrary;
    })();
    TSOS.SystemCallLibrary = SystemCallLibrary;
})(TSOS || (TSOS = {}));
