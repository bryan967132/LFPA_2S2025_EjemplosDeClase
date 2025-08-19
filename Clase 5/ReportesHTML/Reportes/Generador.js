import fs from 'fs';

export const generarHistorial = (nombreArchivo, informacion) => {
    let htmlCode = `<html>
    <head>
        <title>${nombreArchivo}</title>
    </head>
    <body>
        <style>
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th {
                background-color: #f2f2f2;
                text-align: left;
                padding: 8px;
            }
            td {
                padding: 8px;
                text-align: left;
            }
        </style>
        <h1>${nombreArchivo}</h1>
        <table border="1">
            <tr>
                <th colspan="2">Cliente</th>
                <th colspan="2">Operador</th>
            </tr>
            <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Id</th>
                <th>Nombre</th>
                <th>Calificación</th>
            </tr>\n`;

    informacion.forEach(registro => {
        htmlCode += `            <tr>
                <td>${registro.id_cliente}</td>
                <td>${registro.nombre_cliente}</td>
                <td>${registro.id_operador}</td>
                <td>${registro.nombre_operador}</td>
                <td>${registro.calificacion}</td>
            </tr>\n`;
    });

    htmlCode += `        </table>
    </body>
</html>`

    try {
        const stream = fs.createWriteStream(`./Salidas/${nombreArchivo}.html`, 'utf-8');
        stream.write(htmlCode);
        stream.end();
    } catch (error) {
        console.log("Error al escribir el archivo", error);
    }
}