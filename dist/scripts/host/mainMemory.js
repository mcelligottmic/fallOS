///<reference path="../globals.ts" />
/* ------------
mainMemory.ts
Requires global.ts.
Routines for the host RAM simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
------------ */
var TSOS;
(function (TSOS) {
    var mainMemory = (function () {
        function mainMemory(memory) {
            if (typeof memory === "undefined") { memory = new Array(256); }
            this.memory = memory;
        }
        mainMemory.prototype.init = function () {
        };
        return mainMemory;
    })();
    TSOS.mainMemory = mainMemory;
})(TSOS || (TSOS = {}));
