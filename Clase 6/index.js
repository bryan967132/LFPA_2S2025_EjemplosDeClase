import Scanner from "./Lenguaje/Scanner.js";

const scanner = new Scanner(`EQUIPO ELIMINACION
    TORNEO`);

let token = scanner.next_token();
while(token.type !== 'EOF') {
    console.log(token);
    token = scanner.next_token();
}