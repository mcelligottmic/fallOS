/* ------------
Interrupt.ts
------------ */
var MOS;
(function (MOS) {
    var Interrupt = (function () {
        function Interrupt(irq, params) {
            this.irq = irq;
            this.params = params;
        }
        return Interrupt;
    })();
    MOS.Interrupt = Interrupt;
})(MOS || (MOS = {}));
