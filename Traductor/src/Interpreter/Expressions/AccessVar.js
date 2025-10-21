export default class AccessVar {
    constructor(line, column, id) {
        this.line = line;
        this.column = column;
        this.id = id;
    }

    traducir(env, _) {
        const varType = env.getVar(this.id);
        return { value: this.id, type: varType };
    }
}