import Env from "../Generator/Env.js";

export default class Block {
    constructor(line, column, instructions) {
        this.line = line;
        this.column = column;
        this.instructions = instructions;
    }

    traducir(env, gen) {
        let localEnv = new Env(env, env.name);
        gen.newEnv();
        for(let inst of this.instructions) {
            inst.traducir(localEnv, gen);
        }
        gen.prevEnv();
    }
}