/* ------------
     Kernel.ts

     Requires globals.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8.
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
            _Console = new Console();          // The command line interface / console I/O device.

            // Initialize the console.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            _ProcessManager = new ProcessManager();
            _MemoryManager = new MemoryManager();
            _DisplayManager = new DisplayManager();
            _CPUScheduler = new CPUScheduler();
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate testing.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        }


        public krnOnCPUClockPulse() {
            /* This gets called from the host hardware sim every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */

            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) {
                // If there are no interrupts then run one CPU cycle if there is anything being processed.
                _CPU.cycle();
                //displays cpu, memory, and PCB
                _DisplayManager.updateAll();
                _CPUScheduler.cycle++;
            } else {
                // If there are no interrupts and there is nothing being executed then just be idle.
                this.krnTrace("Idle");
            }
        }


        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  Pages 8 and 560. {
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();              // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case INVAILD_MEMORY_ACCESS_IRQ:
                    this.krnMemoryAccess(params);
                    break;
                case CPU_BREAK_IRQ:
                    //_SystemCallLibrary.krnBreak(params);
                    this.krnBreak(params);
                    break;
                case SYSTEM_CALL_IRQ:
                    this.krnSysCall(params);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        }

        public krnMemoryAccess(params) {
          //save all data on cpu to the process control block
          _CPU.currentProcess.update();
          //end the process
          _CPU.stop();
          //message the user
          _StdOut.putText("INVAILID MEMORY ACCESS...PROGRAM TERMINATED");
          //it would be helpful to add where the error is
        }

        public krnBreak(params) {
          //save all data on cpu to the process control block
          //_CPU.currentProcess.update();
          //end the process
          _MemoryManager.freeSpace[_CPU.currentProcess.pid] = true;
          _StdOut.putText(" Process ID: " + _CPU.currentProcess.pid + " complete ");
          _CPU.stop();
          //_CPU.currentProcess.state = halted or terminated?
          //TODO context switching for project 3
        }

        public krnSysCall(params) {
          var xReg = params[0];
          var yReg = params[1];
          var pcb = params[2];
          //if 1 in Xreg print y
          if (parseInt(xReg, 16) == 1) {
            _StdOut.putText(yReg);
            //if 2 print string starting at location yReg and ending at 00
          } else if (parseInt(xReg, 16) == 2) {
            var byte = _MemoryManager.read(parseInt(yReg, 16), pcb);
            var string = "";
            var offset = 0;
            while (byte != "00") {
              string = string + String.fromCharCode(parseInt(byte, 16));
              offset++;
              byte = _MemoryManager.read((parseInt(
                                  yReg, 16) + offset), pcb);
            }
            _StdOut.putText(string);
          } else {
            _StdOut.putText("INVALID PARAMETER FOR SYSTEM CALL");
          }
        }

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile


        //
        // OS Utility Routines
        //
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        // computer ran into some error
        public krnTrapError(msg) {
          Control.hostLog("OS ERROR - TRAP: " + msg);
          // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
			    _DrawingContext.fillStyle="Blue";
			    _DrawingContext.fillRect(0, 0 , _Canvas.width, _Canvas.height);
			    _StdOut.putText("Your PC ran into a problem that it couldn't handle");
			    TSOS.Control.hostBtnHaltOS_click(this);
          this.krnShutdown();
        }
    }
}
