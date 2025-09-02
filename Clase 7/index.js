import IO from "./IO/IO.js";
import Scanner from "./Lenguaje/Scanner.js";

const io = new IO();

const [input, error] = io.readFile('./Entrada/Entrada.txt');

if (error) {
    console.error(`Error al leer el archivo: ${error.message}`);
    throw new Error(error);
}

const scanner = new Scanner(input);

let token = scanner.next_token();
while(token.type !== 'EOF') {
    console.log(token);
    token = scanner.next_token();
}

io.close();