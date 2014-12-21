///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public currentProcess: PCB = null,
                    public PC: string = "00",
                    public Acc: string = "00",
                    public Xreg: string = "00",
                    public Yreg: string = "00",
                    public Zflag: string = "00",
                    public isExecuting: boolean = false) {

        }

        public init(): void {
          this.currentProcess = null,
          this.PC = "00",
          this.Acc = "00",
          this.Xreg = "00",
          this.Yreg = "00",
          this.Zflag = "00",
          this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            //get next instruction
            var instruction = this.getNextByte();
            switch(instruction) {
            case "A9":
              this.LDAc();
              break;
            case "AD":
              this.LDAm();
              break;
            case "8D":
              this.STA();
              break;
            case "6D":
              this.ADC();
              break;
            case "A2":
              this.LDXc();
              break;
            case "AE":
              this.LDXm();
              break;
            case "A0":
              this.LDYc();
              break;
            case "AC":
              this.LDYm();
              break;
            case "EA":
              this.NOP();
              break;
            case "00":
              this.BRK();
              break;
            case "EC":
              this.CPX();
              break;
            case "D0":
              this.BNE();
              break;
            case "EE":
              this.INC();
              break;
            case "FF":
              this.SYS();
              break;
            }
            //update the PCB
            this.currentProcess.update();
        }

        //CPU starts working on a process
        public start(pcb: PCB): void {
          this.currentProcess = pcb;
          this.PC = pcb.PC,
          this.Acc = pcb.Acc,
          this.Xreg = pcb.Xreg,
          this.Yreg = pcb.Yreg,
          this.Zflag = pcb.Zflag,
          this.isExecuting = true;
        }

        //CPU stops working on a process
        public stop(): void {
          this.init();
        }

        //get element from memory given an address
        public dataAt(location: number): string {
          return _MemoryManager.read(location, this.currentProcess);
        }

        //store element to memory given an address and an element
        public storeAt(location: number, data: string): void {
          //check to see if we have access
          _MemoryManager.write(location, data, this.currentProcess);
        }

        //Increase the PC by a set amount
        public addToPC(num: number): void {
          this.PC = ((parseInt(this.PC, 16) + num) % _MemoryManager.BLOCKSIZE).toString(16).toUpperCase();
        }

        //gets the next byte and returns it as a string
        public getNextByte(): string {
          var byte = this.dataAt(parseInt(this.PC, 16));
          this.addToPC(1);
          return byte.toUpperCase();
        }

        //converts a byte to an Int
        public byteToInt(byte: string): number {
          return parseInt(byte, 16);
        }

        //gets the next two memory locations and returns the equivalent int
        public getNextAddress(): number {
          var location1 = this.getNextByte();
          var location2 = this.getNextByte();
          return parseInt((location2 + location1), 16);
        }

        //LDA A9
        //Load the accumulator with a constant
        public LDAc(): void {
          var constant = this.getNextByte();
          this.Acc = constant;
        }

        //LDA AD
        //Load the accumulator from memory
        public LDAm(): void {
          var address = this.getNextAddress();
          this.Acc = this.dataAt(address);
        }

        //STA 8D
        //Store the accumulator in memory
        public STA(): void {
          var address = this.getNextAddress();
          //store in memory
          this.storeAt(address, this.Acc);
        }

        //ADC 6D
        //Add with carry
        //Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator
        public ADC(): void {
          var address = this.getNextAddress();
          var value = parseInt(this.dataAt(address), 16);
          this.Acc = (parseInt(this.Acc, 16) + value).toString(16).toUpperCase();
        }

        //LDX A2
        //Load the X register with a constant
        public LDXc(): void {
          this.Xreg = this.getNextByte()
        }

        //LDX AE
        //Load the X register from memory
        public LDXm(): void {
          this.Xreg = parseInt(this.dataAt(this.getNextAddress()), 16)
                        .toString(16).toUpperCase();
        }

        //LDY A0
        //Load the Y register from a constant
        public LDYc(): void {
          this.Yreg = this.getNextByte()
        }

        //LDY AC
        //Load the Y register from memory
        public LDYm(): void {
          this.Yreg = parseInt(this.dataAt(this.getNextAddress()), 16)
                        .toString(16).toUpperCase();

        }

        //NOP EA
        //No Operation
        public NOP(): void {
          //...I know a guy who would be upset with the wasted cycle
        }

        //BRK 00
        //Break (which is really a system call)
        public BRK(): void {
          //Exit the process
          _KernelInterruptQueue.enqueue(new Interrupt(CPU_BREAK_IRQ, []));
        }

        //CPX EC
        //Compare a byte in memory to the X-reg sets the Z(zero) flag if equal
        address
        public CPX(): void {
          var address = this.getNextAddress();
          var value = parseInt(this.dataAt(address), 16);
          if (value == parseInt(this.Xreg) ) {
            this.Zflag = "01";
          } else {
            this.Zflag = "00";
          }
        }

        //BNE D0
        //Branch n bytes if Z flag = 0
        public BNE(): void {
          if (this.Zflag == "00") {
            //branch
            this.addToPC(parseInt(this.dataAt(parseInt(this.PC, 16)), 16));
          }
          this.addToPC(1);
        }

        //INC EE
        //Increment the value of a byte
        public INC(): void {
          var address = this.getNextAddress();
          this.storeAt(address, (parseInt(this.dataAt(address), 16) + 1).toString(16).toUpperCase());
        }

        //SYS FF
        //System Call
        public SYS(): void {
          _KernelInterruptQueue.enqueue(new Interrupt(SYSTEM_CALL_IRQ,
                      [this.Xreg, this.Yreg, this.currentProcess]));
        }
    }
}
