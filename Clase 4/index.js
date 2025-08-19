let texto = `id_operador,nombre_operador,estrellas,id_cliente,nombre_cliente
1,Henry,x;x;x;0;0,101,Enzo
2,Ferruccio,x;x;0;0;0,102,Luca`;

let lineas = texto.split(/\n/);

// variables string: \n
// texto de un archivos: \r\n

lineas = lineas.slice(1);

let registroLlamadas = [];

for(let i = 0; i < lineas.length; i++) {
    lineas[i] = lineas[i].split(/,/);
    lineas[i][2] = lineas[i][2].split(/;/);
    lineas[i][2] = lineas[i][2].filter(e => e === 'x').length;

    /*

    registroLlamadas.push(new Llamada(lineas[i][0], lineas[i][1], lineas[i][2], lineas[i][3], lineas[i][4]));

    */
    registroLlamadas.push({
        id_operador: lineas[i][0],
        nombre_operador: lineas[i][1],
        calificacion: lineas[i][2],
        id_cliente: lineas[i][3],
        nombre_cliente: lineas[i][4]
    });
}

console.log(registroLlamadas);