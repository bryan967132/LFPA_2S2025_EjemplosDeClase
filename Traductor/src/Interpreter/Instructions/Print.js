export default class Print {
    constructor(line, column, expression) {
        this.line = line;
        this.column = column;
        this.expression = expression;
    }

    traducir(env, gen) {
        const value = this.expression.traducir(env, gen);
        gen.importFmt();
        gen.addLine(`fmt.Println(${value.value})`);
    }
}