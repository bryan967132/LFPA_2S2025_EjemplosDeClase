import { generarHistorial } from "./Reportes/Generador.js"

let registroLlamadas = [
    {
        id_operador: '1',
        nombre_operador: 'Henry',
        calificacion: 3,
        id_cliente: '101',
        nombre_cliente: 'Enzo'
    },
    {
        id_operador: '2',
        nombre_operador: 'Ferruccio',
        calificacion: 2,
        id_cliente: '102',
        nombre_cliente: 'Luca'
    }
]

generarHistorial("Historial de Llamadas", registroLlamadas);