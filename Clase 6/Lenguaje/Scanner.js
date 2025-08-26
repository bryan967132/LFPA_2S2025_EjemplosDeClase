export default class Scanner {
    constructor(input) {
        this.input = input + '\0';
        this.position = 0;
        this.buffer = '';
        this.line = 1;
        this.column = 1;
    }

    S0() {
        while(this.input[this.position] !== '\0') {
            let currentChar = this.input[this.position]
            if(currentChar.charCodeAt(0) >= 65 && currentChar.charCodeAt(0) <= 90 || currentChar.charCodeAt(0) >= 97 && currentChar.charCodeAt(0) <= 122){
                this.position++;
                this.buffer += currentChar;
                this.column++;
                return this.S1();
            }

            if(currentChar === ' ') {
                this.position++;
                this.column++;
                continue;
            }

            if(currentChar === '\t') {
                this.position++;
                this.column += 4;
                continue;
            }

            if(currentChar === '\n') {
                this.position++;
                this.column = 1;
                this.line++;
                continue;
            }

            // ERROR LÉXICO 
            this.position++;
        }
        return { type: `EOF`, line: this.line, column: this.column }; // End Of File: Final del archivo
    }

    S1() {
        let currentChar = this.input[this.position]
        if(currentChar.charCodeAt(0) >= 65 && currentChar.charCodeAt(0) <= 90 || currentChar.charCodeAt(0) >= 97 && currentChar.charCodeAt(0) <= 122){
            this.position++;
            this.buffer += currentChar;
            this.column++;
            return this.S1();
        }
        let buffer = this.buffer
        this.buffer = '';
        return { lexeme: buffer, type: `KW_${buffer}`, line: this.line, column: this.column }; // Palabra reservada
    }

    next_token() {
        return this.S0();
    }
}