export default class Estudiante {
    constructor(carnet, nombre) {
        this.carnet = carnet;
        this.nombre = nombre;
    }

    /*
    * Muestra un saludo personalizado del estudiante.
    */
    saludar() {
        console.log(`Hola, mi nombre es ${this.nombre} y mi carnet es ${this.carnet}.`);
    }
}