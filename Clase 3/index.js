import fs from 'fs';
import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import Controlador from './Estudiante/Controlador.js';

const controlador = new Controlador();
const rl = readline.createInterface({ input, output });

const leerCampo = (texto) => {
    return new Promise((resolve) => {
        rl.question(`${texto}`, (carnet) => {
            resolve(carnet);
        });
    });
}

const main = async () => {
    let archivo = await leerCampo("Ingrese el nombre del archivo de estudiantes: ");
    console.log(`Cargando estudiantes desde el archivo: ${archivo}`);

    try {
        const contenido = fs.readFileSync(`./Entradas/${archivo}`, 'utf-8');
        console.log("Contenido del archivo:");
        const lineas = contenido.split(/\r\n/); // Vector

        {
        // lineas.forEach((linea, index) => {
        //     console.log(`${index}: ${linea}`);
        // })

        // // Para índices
        // for(let indice in lineas) {
        //     console.log(indice)
        // }

        // // Para valores
        // for(let linea of lineas) {
        //     console.log(linea)
        // }

        // // Para índices con iterador
        // for(let i = 0; i < lineas.length; i ++) {
        //     console.log(`${i}: ${lineas[i]}`);
        // }
        }

        const lineas_cortadas = lineas.map(linea => linea.split('-'));
        // console.log(lineas_cortadas);

        const lineas_sin_encabezado = lineas_cortadas.slice(1);

        lineas_sin_encabezado.forEach((estudiante) => {
            controlador.registrarEstudiante(estudiante[0], estudiante[1], estudiante[2]);
        });

        controlador.mostrarEstudiantes();

        const stream = fs.createWriteStream(`./Salidas/Salida.txt`, 'utf-8');
        
        controlador.estudiantes.forEach((estudiante) => {
            stream.write(estudiante.obtenerString() + '\n');
        });

        stream.end();
    } catch (error) {
        console.log(`\x1b[31mError al leer el archivo: ${error.message}\x1b[0m`);
    }

    rl.close(); // Solo en opción de salir en el menú
}

main();