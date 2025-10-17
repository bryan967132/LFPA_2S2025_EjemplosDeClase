import { errors } from "../Utils/Errors.js";
import Scanner from "./Scanner.js";

/**
 * @typedef {Object} Token
 * @property {string} lexeme - El lexema reconocido.
 * @property {string} type - Tipo de token (por ejemplo, 'TK_id', 'TK_int').
 * @property {number} line - Línea donde se encontró el token.
 * @property {number} column - Columna donde se encontró el token.
 */

export default class Parser {
    /**
     * @type {Scanner}
     */
    #sc

    /** @type {Token|null} Token actual en proceso */
    #current_token

    /**
     * @param {Scanner} sc - Instancia de Scanner que proporciona los tokens.
     */
    constructor(sc) {
        this.#sc = sc;
    }

    parse() {
        this.#START();
    }

    #START() {
        // <START> ::= <MAINFUNCTION> <EOF>
        while(this.#match('TK_comment', 'TK_single_comment')) {
            this.#consume(this.#current_token.type);
        }

        this.#MAINFUNCTION();

        while(!this.#match('EOF')) {
            this.#consume(this.#current_token.type);
            if(this.#match('TK_comment', 'TK_single_comment')) {
                this.#consume(this.#current_token.type);
            } else {
                errors.push({ type: 'Syntax', message: `No se esperaba «${this.#current_token.lexeme}»`, line: this.#current_token.line, column: this.#current_token.column });
            }
        }

        this.#consume('EOF');
    }

    #MAINFUNCTION() {
        // <MAINFUNCTION> ::= 'int' 'main' '(' ')' '{' <INSTRUCTION>* 'return' TK_int ';' '}'
        this.#consume('KW_int');
        this.#consume('KW_main');
        this.#consume('TK_lpar');
        this.#consume('TK_rpar');
        this.#consume('TK_lbrc');

        while(this.#match(
            'KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool',
            'TK_id', 'KW_if', 'KW_for', 'KW_while', 'KW_cout',
            'TK_comment', 'TK_single_comment' // comentarios
        )) {
            if(!this.#match('TK_comment', 'TK_single_comment')) {
                this.#INSTRUCTION();
            } else {
                this.#consume('TK_comment', 'TK_single_comment')
            }
        }

        this.#consume('KW_return');
        this.#consume('TK_int');
        this.#consume('TK_semicolon');
        this.#consume('TK_rbrc');
    }

    #INITVAR() {
        // <INITVAR> ::= <TYPE> TK_id ('=' <EXP>)? (',' TK_id ('=' <EXP>)?)* ';'
        this.#TYPE();
        this.#consume('TK_id');
        if(this.#match('TK_assign')) {
            this.#consume('TK_assign');
            this.#EXP();
        }

        while(this.#match('TK_comma')) {
            this.#consume('TK_comma');
            this.#consume('TK_id');
            if(this.#match('TK_assign')) {
                this.#consume('TK_assign');
                this.#EXP();
            }
        }

        this.#consume('TK_semicolon');
    }

    #ASSIGNVAR() {
        // <ASSIGNVAR> ::= TK_id '=' <EXP> ';'
        this.#consume('TK_id');
        this.#consume('TK_assign');
        this.#EXP();
        this.#consume('TK_semicolon');
    }

    #IF() {
        // <IF> ::= 'if' '(' <EXP> ')' <BLOCK> ('else' <BLOCK>)?
        this.#consume('KW_if');
        this.#consume('TK_lpar');
        this.#EXP();
        this.#consume('TK_rpar');
        this.#BLOCK();
        if(this.#match('KW_else')) {
            this.#consume('KW_else');
            this.#BLOCK();
        }
    }

    #FOR() {
        // <FOR> ::= 'for' '(' <TYPE> TK_id '=' <EXP> ';' <EXP> ';' <INCDEC> ')' <BLOCK>
        this.#consume('KW_for');
        this.#consume('TK_lpar');
        this.#TYPE();
        this.#consume('TK_id');
        this.#consume('TK_assign');
        this.#EXP();
        this.#consume('TK_semicolon');
        this.#EXP();
        this.#consume('TK_semicolon');
        this.#INCDEC();
        this.#consume('TK_rpar');
        this.#BLOCK();
    }

    #INCDEC() {
        // <INCDEC> ::= TK_id ('++' | '--')
        this.#consume('TK_id');
        this.#consume('TK_inc', 'TK_dec');
    }

    #WHILE() {
        // <WHILE> ::= 'while' '(' <EXP> ')' <BLOCK>
        this.#consume('KW_while');
        this.#consume('TK_lpar');
        this.#EXP();
        this.#consume('TK_rpar');
        this.#BLOCK();
    }

    #BLOCK() {
        // <BLOCK> ::= '{' <INSTRUCTION>* '}'
        this.#consume('TK_lbrc');

        while(this.#match(
            'KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool',
            'TK_id', 'KW_if', 'KW_for', 'KW_while', 'KW_cout',
            'TK_comment', 'TK_single_comment' // comentarios
        )) {
            if(!this.#match('TK_comment', 'TK_single_comment')) {
                this.#INSTRUCTION();
            } else {
                this.#consume('TK_comment', 'TK_single_comment')
            }
        }

        this.#consume('TK_rbrc');
    }

    #INSTRUCTION() {
        // <INSTRUCTION> ::= <INITIVAR>
        if(this.#match('KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool')) {
            this.#INITVAR();
            return;
        }
        // <INSTRUCTION> ::= <ASSIGNVAR>
        if(this.#match('TK_id')) {
            this.#ASSIGNVAR();
            return;
        }
        // <INSTRUCTION> ::= <IF>
        if(this.#match('KW_if')) {
            this.#IF();
            return;
        }
        // <INSTRUCTION> ::= <FOR>
        if(this.#match('KW_for')) {
            this.#FOR();
            return;
        }
        // <INSTRUCTION> ::= <WHILE>
        if(this.#match('KW_while')) {
            this.#WHILE();
            return;
        }
        // <INSTRUCTION> ::= <PRINT>
        if(this.#match('KW_cout')) {
            this.#PRINT();
            return;
        }
    }

    #PRINT() {
        // <PRINT> ::= 'cout' '>>' <EXP> '>>' 'endl' ';'
        this.#consume('KW_cout');
        this.#consume('TK_arrow');
        this.#EXP();
        this.#consume('TK_arrow');
        this.#consume('KW_endl');
        this.#consume('TK_semicolon');
    }

    #TYPE() {
        /*
        <TYPE> ::=
            'int'   |
            'float' |
            'Str'   |
            'char'  |
            'bool'
        */
        this.#consume('KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool');
    }

    #EXP() {
        // <EXP> ::= <EXP2> (('==' | '!=' | '<=' | '>=' | '<' | '>') <EXP2>)*
        this.#EXP2();

        while(this.#match('TK_equal', 'TK_notequal', 'TK_grtequal', 'TK_lsequal', 'TK_greater', 'TK_less')) {
            this.#consume('TK_equal', 'TK_notequal', 'TK_grtequal', 'TK_lsequal', 'TK_greater', 'TK_less');
            this.#EXP2();
        }
    }

    #EXP2() {
        // <EXP2> ::= <EXP1> (('+' | '-') <EXP1>)*
        this.#EXP1();

        while(this.#match('TK_add', 'TK_sub')) {
            this.#consume('TK_add', 'TK_sub');
            this.#EXP1();
        }
    }

    #EXP1() {
        // <EXP1> ::= <PRIMITIVE> (('*' | '/') <PRIMITIVE>)*
        this.#PRIMITIVE();

        while(this.#match('TK_mul', 'TK_div')) {
            this.#consume('TK_mul', 'TK_div');
            this.#PRIMITIVE();
        }
    }

    #PRIMITIVE() {
        /*
        <PRIMITIVE> ::=
            TK_id    |
            TK_int   |
            TK_float |
            TK_str   |
            TK_char  |
            'true'   |
            'false'
        */
        this.#consume('TK_id', 'TK_int', 'TK_float', 'TK_str', 'TK_char', 'KW_true', 'KW_false');
    }

    /**
     * @description Consume un token si coincide con el tipo esperado, registra error en caso contrario.
     *
     * @param {...string} types - Tipos de token esperado.
     * @returns {Token|null} Token consumido o null si no coincide.
     */
    #consume(...types) {
        if(this.#match(...types)) {
            return this.#sc.next_token();
        }
        errors.push({ type: 'Syntax', message: `No se esperaba «${this.#current_token.lexeme}»`, line: this.#current_token.line, column: this.#current_token.column });
        return null;
    }

    /**
     * @description Verifica si el siguiente token coincide con alguno de los tipos especificados (lookahead).
     *
     * @param {...string} types - Lista de tipos de token esperados.
     * @returns {boolean} `true` si coincide alguno, `false` en caso contrario.
     */
    #match(...types) {
        this.#current_token = this.#sc.look_ahead();
        return types.includes(this.#current_token.type);
    }
}