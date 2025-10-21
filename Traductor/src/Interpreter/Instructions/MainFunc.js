import Env from "../Generator/Env.js";

export default class MainFunc {
    constructor(line, column, instructions) {
        this.line = line;
        this.column = column;
        this.instructions = instructions;
    }

    traducir(env, gen) {
        const localEnv = new Env(env, env.name);
        gen.addLine("func main() {");
        gen.newEnv();
        for(const inst of this.instructions) {
            inst.traducir(localEnv, gen);
        }
        gen.prevEnv();
        gen.addLine("}");
    }
}