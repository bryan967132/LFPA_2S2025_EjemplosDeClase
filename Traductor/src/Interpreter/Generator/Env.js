export default class Env {
    constructor(prev, name) {
        this.prev = prev;
        this.name = name;
        this.variables = {};
    }

    saveVar(name, type) {
        this.variables[name] = type;
    }

    getVar(name) {
        let currentEnv = this;
        while(currentEnv) {
            if(currentEnv.variables.hasOwnProperty(name)) {
                return this.variables[name];
            }
            currentEnv = currentEnv.prev;
        }
        return null;
    }
}