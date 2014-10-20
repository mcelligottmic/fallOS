///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

			// date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time");
            this.commandList[this.commandList.length] = sc;

			// whereami
            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  "- Displays your current location.");
            this.commandList[this.commandList.length] = sc;

			// rules
            sc = new ShellCommand(this.shellRules,
                                  "rules",
                                  "- rules for a world with zombies");
            this.commandList[this.commandList.length] = sc;

			// BSOD
            sc = new ShellCommand(this.shellBSOD,
                                  "bsod",
                                  "- Blue Screen of Death...great power comes with great responsibility");
            this.commandList[this.commandList.length] = sc;

			// load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- validates the code in User Program Input. Only Hex digits and spaces are valid.");
            this.commandList[this.commandList.length] = sc;

			// status <string>
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string> - Displays <string> under the status bar.");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
            userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

		public shellDate(args) {
			var d = new Date();
            _StdOut.putText("Today's date is " + (d.getMonth() + 1)+ "/" + d.getDate() + "/" + d.getFullYear() +
				" and the time is " + d.getHours() + ":" + d.getMinutes() );
        }

		//tells you where you are...like you didn't know
		public shellWhereAmI(args) {
            _StdOut.putText("Your at a computer...");
        }

		//randomly picks rules from an array base on the time
		public shellRules(args) {
			var list:string[] = ["#1 Cardio","#2 Double Tap","#3 Beware of Bathrooms","#4 Wear Seat Belts","#5 No Attachments",
								"#18 Limber up","#22 When in doubt Know your way out","#31 Check the back seat",
								"#32Enjoy the little things"];
            var date = new Date();
			var time = (date.getMilliseconds());
			if (time < 100) {
                _StdOut.putText(list[0]);
			} else if (time < 200) {
				_StdOut.putText(list[1]);
			} else if (time < 300) {
				_StdOut.putText(list[2]);
			} else if (time < 400) {
				_StdOut.putText(list[3]);
			} else if (time < 500) {
				_StdOut.putText(list[4]);
			} else if (time < 600) {
				_StdOut.putText(list[5]);
			} else if (time < 700) {
				_StdOut.putText(list[6]);
			} else if (time < 800) {
				_StdOut.putText(list[7]);
			} else {
				_StdOut.putText(list[8]);
			}
        }

		//Error screen when Kernel traps an OS error
		public shellBSOD(args) {
            //create an interrupt used 2 instead of standard debug exception due to it already being used
			_Kernel.krnInterruptHandler(2, "test");
		}

		//validates the user code in the HTML5 text area
		public shellLoad(args) {
      //load the text
			var temp = <HTMLTextAreaElement>document.getElementById('taProgramInput');
			var program : string = temp.value;
			program = program.replace(/\s+/g, '');
<<<<<<< HEAD
      var valid = true;
      // \d matches to a digit
      var re = /[A-Fa-f0-9][A-Fa-f0-9]/;
      //if the program is odd it is invalid and we don't need to check
      if (program.length % 2 == 0) {
        for (var i = 0; i < program.length; i += 2) {
          if (!re.test(program)) {
            valid = false;
          }
        }
      } else {
          valid = false;
        }
        if (!valid) {
          _StdOut.putText("invalid...do you need some help?");
        } else {
				      _StdOut.putText("successfully loaded");
              //store program into main memory starting at location $0000
			  }
    }//end Load

=======
			var valid : Boolean = true;
			// \d matches to a digit
			var re = /[A-Fa-f0-9][A-Fa-f0-9]/;
			//if the program is odd it is invalid and we don't need to check
			if (program.length%2 == 0) {
				for (var i = 0; i < program.length; i +=2) {
					if (!re.test(program)) {
						valid = false;
					}
				}
			} else {
				valid = false;
			}
			if (!valid) {
				_StdOut.putText("invalid...do you need some help?");
			} else {
				_StdOut.putText("successfully loaded");
			}
		}
		
>>>>>>> 8f6c57478c14104aba11d51d9d8c6b4a8a3af088
		public shellStatus(args) {
            if (args.length > 0) {
				var newString: string = "";
				for(var i = 0; i < args.length; i++){
					newString = newString + args[i] + " ";
				}
                document.getElementById('statusBox').innerHTML = newString;
            } else {
                document.getElementById('statusBox').innerHTML = "Usage: status <string>  Please supply a string.";
            }
        }

    }
}
