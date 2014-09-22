///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {

        }
		
		//lazy expansion
		public growCanvas(): void {
			if ( _Canvas.height - this.currentYPosition < 400) {
				var temp = _DrawingContext.getImageData(0,0,_Canvas.width, _Canvas.height);
				_Canvas.height = _Canvas.height + 400;
				_DrawingContext.putImageData(temp,0,0); 
			}
		}

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    this.growCanvas();
					// The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if(chr === String.fromCharCode(8)) { //     Backspace
					//update the canvas
					//_DrawingContext.fillStyle="red";
					_DrawingContext.clearRect(this.currentXPosition - _DrawingContext.measureText(this.currentFont, 
													this.currentFontSize, this.buffer.charAt(this.buffer.length-1)) ,
												this.currentYPosition - 13,
												_DrawingContext.measureText(this.currentFont, 
													this.currentFontSize, this.buffer.charAt(this.buffer.length-1)), 
												this.currentFontSize + 5);
					this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, 
													this.currentFontSize, this.buffer.charAt(this.buffer.length-1));
					//remove the last character from our buffer
					this.buffer = this.buffer.substr(0, this.buffer.length-1);
				} else if(chr === String.fromCharCode(9)) { //     Tab
					// auto-complete from _OsShell.commandList
					//compare buffer to commandList
					var initLength = this.buffer.length;
					for (var i = 0; i < _OsShell.commandList.length; i++) {
						var temp = _OsShell.commandList[i].command.substr(0, this.buffer.length);
						if (this.buffer === temp)
						{
							this.buffer = _OsShell.commandList[i].command;
							for (var j = initLength; j < _OsShell.commandList[i].command.length; j++) {
								this.putText(_OsShell.commandList[i].command.charAt(j));
							}
						}
					}
				} else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (Project 1)
        }
    }
 }
