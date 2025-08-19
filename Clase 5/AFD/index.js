import AFD from "./AFD.js";

let cadena = "abacaba";
let afd = new AFD(cadena);
let result = afd.analyze();
console.log(result ? `Cadena "${cadena}" aceptada` : `Cadena "${cadena}" no aceptada`);

cadena = "abababab";
afd = new AFD(cadena);
result = afd.analyze();
console.log(result ? `Cadena "${cadena}" aceptada` : `Cadena "${cadena}" no aceptada`);

cadena = "bababab";
afd = new AFD(cadena);
result = afd.analyze();
console.log(result ? `Cadena "${cadena}" aceptada` : `Cadena "${cadena}" no aceptada`);

cadena = "aaabababab";
afd = new AFD(cadena);
result = afd.analyze();
console.log(result ? `Cadena "${cadena}" aceptada` : `Cadena "${cadena}" no aceptada`);