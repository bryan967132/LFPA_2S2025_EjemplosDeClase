export default class Estudiante {
    constructor(carnet, nombre, apellido) {
        this.carnet = carnet;
        this.nombre = nombre;
        this.apellido = apellido;
    }

    saludar() {
        console.log(`Hola, mi nombre es ${this.nombre} ${this.apellido} y mi carnet es ${this.carnet}.`);
    }

    obtenerString() {
        return `Hola, mi nombre es ${this.nombre} ${this.apellido} y mi carnet es ${this.carnet}.`;
    }
}