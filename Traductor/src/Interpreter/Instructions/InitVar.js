import Type from "../Utils/Type.js";

export default class InitVar {
    constructor(line, columna, inits) {
        this.line = line;
        this.columna = columna;
        this.inits = inits;
    }

    traducir(env, gen) {
        for(const init of this.inits) {
            let v;
            if(init.value != null) {
                v = init.value?.traducir(env, gen);
            } else {
                if(init.type === Type.INT) {
                    v = { value: '0', type: Type.INT };
                } else if(init.type === Type.FLOAT) {
                    v = { value: '0.0', type: Type.FLOAT };
                } else if(init.type === Type.BOOLEAN) {
                    v = { value: 'false', type: Type.BOOLEAN };
                } else if(init.type === Type.CHAR) {
                    v = { value: "'\u0000'", type: Type.CHAR };
                } else if(init.type === Type.STRING) {
                    v = { value: '""', type: Type.STRING };
                }
            }
            env.saveVar(init.id, init.type);
            gen.addLine(`var ${init.id} ${init.type.typeDest} = ${v.value}`);
        }
    }
}