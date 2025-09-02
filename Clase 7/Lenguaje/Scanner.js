export default class Scanner {
    constructor(input) {
        this.input = input.replace(/\r\n/g, '\n') + '\0';
        this.pos_char = 0;
        this.buffer = '';
        this.char_line = 1;
        this.char_col = 1;
        this.next_char = '';
        this.keywords = {
            TORNEO: 'KW_torneo',
            EQUIPOS: 'KW_equipos',
            equipo: 'KW_equipo',
        }
    }

    initBuffer(current_char) {
        this.buffer = current_char;
        this.char_col ++;
        this.pos_char ++;
        this.last_char = current_char;
    }

    addBuffer(current_char) {
        this.buffer += current_char;
        this.char_col ++;
        this.pos_char ++;
        this.last_char = current_char;
    }

    S0() {
        while(this.input[this.pos_char] !== '\0') {
            this.next_char = this.input[this.pos_char]
            if(
                // A-Z
                this.next_char.charCodeAt(0) >= 65 && this.next_char.charCodeAt(0) <= 90 ||
                // a-z
                this.next_char.charCodeAt(0) >= 97 && this.next_char.charCodeAt(0) <= 122
            ) {
                this.initBuffer(this.next_char);
                return this.S1();
            }

            // CARACTERES IGNORADOS
            if(this.next_char === ' ') {
                this.char_col ++;
            }
            else if(this.next_char === '\t') {
                this.char_col += 4;
            }
            else if(this.next_char === '\n') {
                this.char_col = 1;
                this.char_line ++;
            }
            // ERROR LÉXICO 
            else {
                this.char_col ++;
                console.log(`Error Léxico: Símbolo no reconocido '${this.next_char}'. [${this.char_line}:${this.char_col}]`);
            }

            this.pos_char ++;
        }
        return { type: `EOF`, line: this.char_line, column: this.char_col }; // End Of File: Final del archivo
    }

    S1() {
        this.next_char = this.input[this.pos_char]
        if(
            // A-Z
            this.next_char.charCodeAt(0) >= 65 && this.next_char.charCodeAt(0) <= 90 ||
            // a-z
            this.next_char.charCodeAt(0) >= 97 && this.next_char.charCodeAt(0) <= 122
        ){
            this.addBuffer(this.next_char);
            return this.S1();
        }

        // Retorna el token reconocido
        return { lexeme: this.buffer, type: this.keywords[this.buffer] || 'TK_id', line: this.char_line, column: this.char_col }; // Palabra reservada
    }

    next_token = () => this.S0();
}