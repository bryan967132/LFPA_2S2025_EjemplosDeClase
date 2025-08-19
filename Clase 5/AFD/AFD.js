export default class AFD {
    constructor(cadena) {
        this.cadena = cadena + '\0';
        this.index = 0;
    }

    q0() {
        if(this.cadena[this.index] === 'a') {
            this.index++;
            return this.q1();
        }
        if(this.cadena[this.index] === 'b') {
            this.index++;
            return this.q3();
        }
        return false; // No aceptamos la cadena
    }

    q1() {
        if(this.cadena[this.index] === 'a') {
            this.index++;
            return this.q3();
        }
        if(this.cadena[this.index] === 'b') {
            this.index++;
            return this.q2();
        }
        return false; // No aceptamos la cadena
    }

    q2() {
        if(this.cadena[this.index] === 'a') {
            this.index++;
            return this.q1();
        }
        if(this.cadena[this.index] === 'b') {
            this.index++;
            return this.q3();
        }
        if(this.cadena[this.index] === '\0') {
            return true; // Cadena aceptada
        }
        return false; // No aceptamos la cadena
    }

    q3() {
        if(this.cadena[this.index] === 'a') {
            this.index++;
            return this.q3();
        }
        if(this.cadena[this.index] === 'b') {
            this.index++;
            return this.q3();
        }
        return false; // No aceptamos la cadena
    }

    analyze() {
        return this.q0();
    }
}