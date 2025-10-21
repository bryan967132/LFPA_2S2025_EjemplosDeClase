import Type from "../Utils/Type.js";

export default class Arithmetic {
    constructor(line, column, op1, sign, op2) {
        this.line = line;
        this.column = column;
        this.op1 = op1;
        this.sign = sign;
        this.op2 = op2;
    }

    traducir(env, gen) {
        let op1 = this.op1.traducir(env, gen);
        let op2 = this.op2.traducir(env, gen);
        return {value: `${op1.value} ${this.sign} ${op2.value}`, type: Type.BOOLEAN};
    }
}