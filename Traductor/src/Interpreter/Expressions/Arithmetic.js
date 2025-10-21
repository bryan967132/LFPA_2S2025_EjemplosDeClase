import Type from "../Utils/Type.js";

const suma = [
    //            INT          FLOAT        STRING       BOOLEAN      CHAR
    /* INT    */ [Type.INT,    Type.FLOAT,  Type.STRING, -1,          -1],
    /* FLOAT  */ [Type.FLOAT,  Type.FLOAT,  Type.STRING, -1,          -1],
    /* STRING */ [Type.STRING, Type.STRING, Type.STRING, Type.STRING, Type.STRING],
    /* BOOLEAN*/ [-1,          -1,          Type.STRING, -1,          -1],
    /* CHAR   */ [-1,          -1,          Type.STRING, -1,          -1],
]

// - * /
const ops = [
    //           INT          FLOAT       STRING  BOOLEAN CHAR
    /* INT    */ [Type.INT,   Type.FLOAT, -1,     -1,     -1],
    /* FLOAT  */ [Type.FLOAT, Type.FLOAT, -1,     -1,     -1],
    /* STRING */ [-1,         -1,         -1,     -1,     -1],
    /* BOOLEAN*/ [-1,         -1,         -1,     -1,     -1],
    /* CHAR   */ [-1,         -1,         -1,     -1,     -1],
]

export default class Arithmetic {
    constructor(line, column, op1, sign, op2) {
        this.line = line;
        this.column = column;
        this.op1 = op1;
        this.sign = sign;
        this.op2 = op2;
    }

    traducir(env, gen) {
        if(this.sign === '+') {
            return this.add(env, gen);
        }
        if(this.sign === '-' || this.sign === '*' || this.sign === '/') {
            return this.op(env, gen);
        }
    }

    add(env, gen) {
        let op1 = this.op1.traducir(env, gen);
        let op2 = this.op2.traducir(env, gen);
        let typeResult;
        if((typeResult = suma[op1.type.ord][op2.type.ord]) !== -1) {
            if(typeResult === Type.STRING) {
                if(op1.type !== Type.STRING) {
                    gen.importFmt();
                    op1.value = `fmt.Sprint(${op1.value})`
                }
                if(op2.type !== Type.STRING) {
                    gen.importFmt();
                    op2.value = `fmt.Sprint(${op2.value})`
                }
            }
            return {value: `${op1.value} + ${op2.value}`, type: typeResult};
        }
    }

    op(env, gen) { // - * /
        let op1 = this.op1.traducir(env, gen);
        let op2 = this.op2.traducir(env, gen);
        let typeResult;
        if((typeResult = ops[op1.type.ord][op2.type.ord]) !== -1) {
            return {value: `${op1.value} ${this.sign} ${op2.value}`, type: typeResult};
        }
    }
}