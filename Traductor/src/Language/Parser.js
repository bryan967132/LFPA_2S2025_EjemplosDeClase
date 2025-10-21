import { errors } from "../Utils/Errors.js";
import Scanner from "./Scanner.js";
import Type from "../Interpreter/Utils/Type.js";
// Expresiones
import AccesVar from "../Interpreter/Expressions/AccessVar.js";
import Arithmetic from "../Interpreter/Expressions/Arithmetic.js";
import Primitive from "../Interpreter/Expressions/Primitive.js";
import Relational from "../Interpreter/Expressions/Relational.js";
// Instrucciones
import Block from "../Interpreter/Instructions/Block.js";
import InitVar from "../Interpreter/Instructions/InitVar.js";
import MainFunc from "../Interpreter/Instructions/MainFunc.js";
import Print from "../Interpreter/Instructions/Print.js";

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
        return this.#START();
    }

    #START() {
        // <START> ::= <MAINFUNCTION> <EOF>
        while(this.#match('TK_comment', 'TK_single_comment')) {
            this.#consume(this.#current_token.type);
        }

        let f = this.#MAINFUNCTION();

        while(!this.#match('EOF')) {
            this.#consume(this.#current_token.type);
            if(this.#match('TK_comment', 'TK_single_comment')) {
                this.#consume(this.#current_token.type);
            } else {
                errors.push({ type: 'Syntax', message: `No se esperaba «${this.#current_token.lexeme}»`, line: this.#current_token.line, column: this.#current_token.column });
            }
        }

        this.#consume('EOF');

        return f;
    }

    #MAINFUNCTION() {
        // <MAINFUNCTION> ::= 'int' 'main' '(' ')' '{' <INSTRUCTION>* 'return' TK_int ';' '}'
        let i = this.#consume('KW_int');
        this.#consume('KW_main');
        this.#consume('TK_lpar');
        this.#consume('TK_rpar');
        this.#consume('TK_lbrc');

        let instructions = [];

        while(this.#match(
            'KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool',
            'TK_id', 'KW_if', 'KW_for', 'KW_while', 'KW_cout',
            'TK_comment', 'TK_single_comment' // comentarios
        )) {
            if(!this.#match('TK_comment', 'TK_single_comment')) {
                let ins = this.#INSTRUCTION();
                instructions.push(ins);
            } else {
                let comm = this.#consume('TK_comment', 'TK_single_comment');
                instructions.push(comm);
            }
        }

        this.#consume('KW_return');
        this.#consume('TK_int');
        this.#consume('TK_semicolon');
        this.#consume('TK_rbrc');

        return new MainFunc(i.line, i.column, instructions);
    }

    #INITVAR() {
        // <INITVAR> ::= <TYPE> TK_id ('=' <EXP>)? (',' TK_id ('=' <EXP>)?)* ';'
        let inits = [];

        let t = this.#TYPE();
        let id = this.#consume('TK_id');
        let v = null;

        if(this.#match('TK_assign')) {
            this.#consume('TK_assign');
            v = this.#EXP();
        }

        inits.push({ id: id.lexeme, type: t, value: v });

        while(this.#match('TK_comma')) {
            this.#consume('TK_comma');
            id = this.#consume('TK_id');
            v = null;
            if(this.#match('TK_assign')) {
                this.#consume('TK_assign');
                v = this.#EXP();
            }

            inits.push({ id: id.lexeme, type: t, value: v });
        }

        this.#consume('TK_semicolon');
        return new InitVar(id.line, id.column, inits);
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
        let l = this.#consume('TK_lbrc');

        let instructions = [];

        while(this.#match(
            'KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool',
            'TK_id', 'KW_if', 'KW_for', 'KW_while', 'KW_cout',
            'TK_comment', 'TK_single_comment' // comentarios
        )) {
            if(!this.#match('TK_comment', 'TK_single_comment')) {
                let ins = this.#INSTRUCTION();
                instructions.push(ins);
            } else {
                let comm = this.#consume('TK_comment', 'TK_single_comment')
                instructions.push(comm);
            }
        }

        this.#consume('TK_rbrc');

        return new Block(l.line, l.column, instructions);
    }

    #INSTRUCTION() {
        // <INSTRUCTION> ::= <INITIVAR>
        if(this.#match('KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool')) {
            return this.#INITVAR();
        }
        // <INSTRUCTION> ::= <ASSIGNVAR>
        if(this.#match('TK_id')) {
            return this.#ASSIGNVAR();
        }
        // <INSTRUCTION> ::= <IF>
        if(this.#match('KW_if')) {
            return this.#IF();
        }
        // <INSTRUCTION> ::= <FOR>
        if(this.#match('KW_for')) {
            return this.#FOR();
        }
        // <INSTRUCTION> ::= <WHILE>
        if(this.#match('KW_while')) {
            return this.#WHILE();
        }
        // <INSTRUCTION> ::= <PRINT>
        if(this.#match('KW_cout')) {
            return this.#PRINT();
        }
        return null;
    }

    #PRINT() {
        // <PRINT> ::= 'cout' '>>' <EXP> '>>' 'endl' ';'
        let l = this.#consume('KW_cout');
        this.#consume('TK_arrow');
        let e = this.#EXP();
        this.#consume('TK_arrow');
        this.#consume('KW_endl');
        this.#consume('TK_semicolon');
        return new Print(l.line, l.column, e);
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
        let t = this.#consume('KW_int', 'KW_float', 'KW_Str', 'KW_char', 'KW_bool');
        if(t.type === 'KW_int') {
            return Type.INT;
        }
        if(t.type === 'KW_float') {
            return Type.FLOAT;
        }
        if(t.type === 'KW_Str') {
            return Type.STRING;
        }
        if(t.type === 'KW_char') {
            return Type.CHAR;
        }
        if(t.type === 'KW_bool') {
            return Type.BOOLEAN;
        }
    }

    #EXP() {
        // <EXP> ::= <EXP2> (('==' | '!=' | '<=' | '>=' | '<' | '>') <EXP2>)*
        let e1 = this.#EXP2();

        while(this.#match('TK_equal', 'TK_notequal', 'TK_grtequal', 'TK_lsequal', 'TK_greater', 'TK_less')) {
            let s = this.#consume('TK_equal', 'TK_notequal', 'TK_grtequal', 'TK_lsequal', 'TK_greater', 'TK_less');
            let e2 = this.#EXP2();
            e1 = new Relational(e1.line, e1.column, e1, s.lexeme, e2);
        }

        return e1;
    }

    #EXP2() {
        // <EXP2> ::= <EXP1> (('+' | '-') <EXP1>)*
        let e1 = this.#EXP1();

        while(this.#match('TK_add', 'TK_sub')) {
            let s = this.#consume('TK_add', 'TK_sub');
            let e2 = this.#EXP1();
            e1 = new Arithmetic(e1.line, e1.column, e1, s.lexeme, e2);
        }

        return e1;
    }

    #EXP1() {
        // <EXP1> ::= <PRIMITIVE> (('*' | '/') <PRIMITIVE>)*
        let e1 = this.#PRIMITIVE();

        while(this.#match('TK_mul', 'TK_div')) {
            let s = this.#consume('TK_mul', 'TK_div');
            let e2 = this.#PRIMITIVE();
            e1 = new Arithmetic(e1.line, e1.column, e1, s.lexeme, e2);
        }

        return e1;
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
            'false'  |
            '(' <EXP> ')'
        */

        if(this.#match('TK_id', 'TK_int', 'TK_float', 'TK_str', 'TK_char', 'KW_true', 'KW_false')) {
            let p = this.#consume('TK_id', 'TK_int', 'TK_float', 'TK_str', 'TK_char', 'KW_true', 'KW_false');
            if(p) {
                if(p.type === 'TK_id') {
                    return new AccesVar(p.line, p.column, p.lexeme);
                }
                if(p.type === 'TK_int') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.INT);
                }
                if(p.type === 'TK_float') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.FLOAT);
                }
                if(p.type === 'TK_str') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.STRING);
                }
                if(p.type === 'TK_char') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.CHAR);
                }
                if(p.type === 'KW_true' || p.type === 'KW_false') {
                    return new Primitive(p.line, p.column, p.lexeme, Type.BOOLEAN);
                }
            }
        }
        if(this.#match('TK_lpar')) {
            let p = this.#consume('TK_lpar');
            let v = this.#EXP();
            this.#consume('TK_rpar');

            return {
                line: p.line,
                column: p.column,
                traducir: (env, gen) => {
                    let value = v.traducir(env, gen);
                    return {value: `(${value.value})`, type: value.type};
                }
            };
        }
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