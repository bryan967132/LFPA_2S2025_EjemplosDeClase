export default class GenGo {
    constructor() {
        this.imports = [];
        this.code = [];
        this.instructions = [];
        this.tabs = 0;
        this.fmt = false;
    }

    newEnv() {
        this.tabs ++;
    }

    prevEnv() {
        this.tabs --;
    }

    importFmt() {
        if(!this.fmt) {
            this.fmt = true;
        }
    }

    addLine(line) {
        this.instructions.push(`${'    '.repeat(this.tabs)}${line}`);
    }

    getCode() {
        this.code.push('package main\n');
        if(this.fmt) {
            this.code.push('import "fmt"\n');
        }

        this.code.push(...this.instructions);

        return this.code.join('\n');
    }
}