///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);

                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
                //Digits keys and some punctuation
            } else if ((keyCode >= 48) && (keyCode <= 57) || (keyCode == 59) || (keyCode == 61)) {
                chr = String.fromCharCode(keyCode);
                if (isShifted) {
                    // characters in the list are as follows )!@#$%^&*(null:null+
                    var charShift = [41, 33, 64, 35, 36, 37, 94, 38, 42, 40, 0, 58, 0, 43];
                    chr = String.fromCharCode(charShift[keyCode - 48]);
                }
                _KernelInputQueue.enqueue(chr);
                //other punctuation
            } else if ((keyCode == 173) || (keyCode == 188) || (keyCode == 190) || (keyCode == 191) || (keyCode == 192) || (keyCode == 219) || (keyCode == 220) || (keyCode == 221) || (keyCode == 222)) {
                switch (keyCode) {
                    case 173:
                        chr = String.fromCharCode(45);
                        if (isShifted)
                            chr = String.fromCharCode(95);
                        break;
                    case 188:
                        chr = String.fromCharCode(44);
                        if (isShifted)
                            chr = String.fromCharCode(60);
                        break;
                    case 190:
                        chr = String.fromCharCode(46);
                        if (isShifted)
                            chr = String.fromCharCode(62);
                        break;
                    case 191:
                        chr = String.fromCharCode(47);
                        if (isShifted)
                            chr = String.fromCharCode(63);
                        break;
                    case 192:
                        chr = String.fromCharCode(96);
                        if (isShifted)
                            chr = String.fromCharCode(126);
                        break;
                    case 219:
                        chr = String.fromCharCode(91);
                        if (isShifted)
                            chr = String.fromCharCode(123);
                        break;
                    case 220:
                        chr = String.fromCharCode(92);
                        if (isShifted)
                            chr = String.fromCharCode(124);
                        break;
                    case 221:
                        chr = String.fromCharCode(93);
                        if (isShifted)
                            chr = String.fromCharCode(125);
                        break;
                    case 222:
                        chr = String.fromCharCode(39);
                        if (isShifted)
                            chr = String.fromCharCode(34);
                        break;
                }
                _KernelInputQueue.enqueue(chr);
            } else if ((keyCode == 32) || (keyCode == 8) || (keyCode == 9) || (keyCode == 13)) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
