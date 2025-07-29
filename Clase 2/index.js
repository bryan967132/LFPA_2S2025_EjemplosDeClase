import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import Controlador from './Estudiante/Controlador.js';

const controlador = new Controlador();

const rl = readline.createInterface({ input, output });

const leerCampo = (texto) => {
    return new Promise((resolve) => {
        rl.question(`${texto}: `, (carnet) => {
            resolve(carnet);
        });
    });
}

function imprimirOpciones() {
    console.log("1. Registrar Estudiante");
    console.log("2. Mostrar Estudiantes");
    console.log("3. Actualizar Estudiante");
    console.log("4. Eliminar Estudiante");
    console.log("5. Salir");
}

const main = () => {
    imprimirOpciones();

    rl.question("Seleccione una opción: ", ejecutarOpcion);
}

const ejecutarOpcion = async (opcion) => {
    switch(opcion) {
        case '1':
            console.log("Registrar Estudiante");
            let carnet = await leerCampo("Carnet");
            let nombre = await leerCampo("Nombre");

            const EXITO = controlador.registrarEstudiante(carnet, nombre);
            if(EXITO) {
                console.log(`\x1b[32mEstudiante ${nombre} registrado exitosamente con carnet ${carnet}.\x1b[0m`);
            } else {
                console.log(`\x1b[31mEstudiante ${nombre} con carnet ${carnet} ya existe en el sistema.\x1b[0m`);
            }

            main();
            break;
        case '2':
            console.log("Mostrar Estudiantes");
            controlador.mostrarEstudiantes();
            main();
            break;
        case '3':
            console.log("Actualizar Estudiante");
            // Aquí iría la lógica para actualizar un archivo
            main();
            break;
        case '4':
            console.log("Eliminar Estudiante");
            // Aquí iría la lógica para eliminar un archivo
            main();
            break;
        case '5':
            console.log("Saliendo del programa...");
            rl.close();
            return;
    }
}

main();