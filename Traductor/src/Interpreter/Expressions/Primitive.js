export default class Primitive {
    constructor(line, column, value, type) {
        this.line = line;
        this.column = column;
        this.value = value;
        this.type = type;
    }

    traducir(_, __) {
        return {value: this.value, type: this.type};
    }
}