///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof buffer === "undefined") { buffer = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            //properties
            this.historyRecall = [];
            this.currentRecall = 0;
            this.linesFromCommand = 0;
        }
        //lazy expansion
        Console.prototype.growCanvas = function () {
            if (_Canvas.height - this.currentYPosition < 400) {
                var temp = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
                _Canvas.height = _Canvas.height + 400;
                _DrawingContext.putImageData(temp, 0, 0);
            }
        };

        //line wrap
        Console.prototype.wrapLine = function (text) {
            var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);

            //if its going to be pasted the canvas move to next line and print
            if (_Canvas.width <= this.currentXPosition + offset) {
                _Console.advanceLine();
                this.linesFromCommand = this.linesFromCommand + 1;
            }
        };

        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    this.growCanvas();

                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);

                    //store the line for later use
                    this.historyRecall.push(this.buffer);
                    this.currentRecall = this.currentRecall + 1;
                    if (this.historyRecall.length === 1) {
                        this.currentRecall = this.currentRecall - 1;
                    }

                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr === String.fromCharCode(8)) {
                    /*
                    if ( (this.linesFromCommand != 0) &&
                    (this.currentXPosition == _DrawingContext.measureText(this.currentFont,
                    this.currentFontSize, this.buffer.charAt(this.buffer.length-1) ) ) &&
                    (this.currentYPosition != _DefaultFontSize) ) {
                    this.currentYPosition -= _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
                    this.currentXPosition = _Canvas.width - _DrawingContext.measureText(this.currentFont,
                    this.currentFontSize, this.buffer.charAt(this.buffer.length-1));
                    }
                    */
                    //update the canvas
                    //_DrawingContext.fillStyle="red";
                    _DrawingContext.clearRect(this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1)), this.currentYPosition - 13, _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1)), this.currentFontSize + 5);
                    this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer.charAt(this.buffer.length - 1));

                    //remove the last character from our buffer
                    this.buffer = this.buffer.substr(0, this.buffer.length - 1);
                } else if (chr === String.fromCharCode(9)) {
                    // auto-complete from _OsShell.commandList
                    //compare buffer to commandList
                    var initLength = this.buffer.length;
                    for (var i = 0; i < _OsShell.commandList.length; i++) {
                        var temp = _OsShell.commandList[i].command.substr(0, this.buffer.length);
                        if (this.buffer === temp) {
                            this.buffer = _OsShell.commandList[i].command;
                            for (var j = initLength; j < _OsShell.commandList[i].command.length; j++) {
                                this.putText(_OsShell.commandList[i].command.charAt(j));
                            }
                        }
                    }
                    //used 130 and 132 as the up and down arrows have no ascii values and these values are not likely to be used.
                } else if (chr === "100" || chr === "102") {
                    //clear line
                    _DrawingContext.clearRect(13, this.currentYPosition - 13, 500, this.currentFontSize + 5);
                    this.currentXPosition = 13;
                    if (chr === "100") {
                        if (this.currentRecall != 0) {
                            this.buffer = this.historyRecall[this.currentRecall];
                            this.currentRecall = this.currentRecall - 1;
                        } else {
                            this.buffer = this.historyRecall[this.currentRecall];
                        }
                    } else {
                        if (this.currentRecall != this.historyRecall.length - 1) {
                            this.buffer = this.historyRecall[this.currentRecall];
                            this.currentRecall = this.currentRecall + 1;
                        } else {
                            this.buffer = this.historyRecall[this.currentRecall];
                        }
                    }

                    for (var j = 0; j < this.buffer.length; j++) {
                        this.putText(this.buffer.charAt(j));
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
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                //if text is too long, cut
                if (_DrawingContext.measureText(this.currentFont, this.currentFontSize, text) > _Canvas.width) {
                    //separates by space so it looks nice :)
                    var splitted = text.split(" ");
                    for (var i = 0; i < splitted.length; i++) {
                        if (_Canvas.width <= this.currentXPosition + _DrawingContext.measureText(this.currentFont, this.currentFontSize, splitted[i])) {
                            this.advanceLine();
                        }
                        this.putText(splitted[i]);
                        this.putText(" ");
                    }
                    text = "          ";
                }

                //check and see if we have enough room to print, if not newline.
                this.wrapLine(text);

                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);

                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };

        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;

            /*
            * Font size measures from the baseline to the highest point in the font.
            * Font descent measures from the baseline to the lowest point in the font.
            * Font height margin is extra spacing between the lines.
            */
            this.currentYPosition += _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            // TODO: Handle scrolling. (Project 1)
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
