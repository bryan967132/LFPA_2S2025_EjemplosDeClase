import Estudiante from "./Estudiante.js";

export default class Controlador {
    constructor() {
        this.estudiantes = [];
    }

    registrarEstudiante(carnet, nombre) {
        const nuevoEstudiante = new Estudiante(carnet, nombre);

        for(const estudiante of this.estudiantes) {
            if(estudiante.carnet === carnet) {
                return false; // Carnet ya existe
            }
        }

        this.estudiantes.push(nuevoEstudiante);
        return true; // Registro exitoso
    }

    mostrarEstudiantes() {
        if(this.estudiantes.length === 0) {
            console.log("No hay estudiantes registrados.");
            return;
        }

        console.log("Lista de Estudiantes:");
        this.estudiantes.forEach(estudiante => {
            estudiante.saludar();
        });
    }
}