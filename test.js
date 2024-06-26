/*
Salen mas
1, 2 y 4, 15, 17, 18, 21, 22, 23, 2, 32, 33

Los números primos que podemos conseguir en el rango de números que están disponibles para el loto son: 
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31.

Usualmente, o con mayor exactitud, en un 80% de las oportunidades la suma de los números ganadores del
loto están entre 83 y 148.

Pero si lo que buscas es aumentar las probabilidades en tu búsqueda de cómo ganar el loto entonces incluye 
no menos de uno y no más de dos números de dos dígitos.

Después se deben restar el de la izquierda con el de la derecha, repetir el proceso moviéndonos un 
espacio a la derecha.

Al hacer esto nos daríamos cuenta de que la resta siempre está entre 1 y 13. Debes hacer*/

// const masSalen = [1, 2, 4, 15, 17, 18, 21, 22, 23, 27, 32, 33, 37, 38, 39];
// const primos = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

// const validarExactitud = (array) => {
//     let tempValue = 0;
//     array.forEach(element => {
//         tempValue = element + tempValue;
//     });

//     return tempValue >= 83 && tempValue <= 148 ? true : false;
// };

// const validarIzquierda = (array) => {
//     const tempArray = array.sort((a,b)=>a-b).reverse();
//     let result = false;
//     let i = 0;

//     do {
//         if (((tempArray[i] - tempArray[i+1]) >= 1) && ((tempArray[i] - tempArray[i+1]) <= 13)) {
//             result = true;
//         } else {
//             result = false;
//         };
//         i = i + 1;
//     } while (i < 4);

//     return result;
// };

// const getNumeros = async () => {
//     const response = await fetch('https://integration.jps.go.cr//api/App/lotto/page');
//     const numeros = await response.json();
//     console.log(numeros);

//     return numeros;
// };

// const randonNumber = () => {
//     return (Math.floor(Math.random() * 40) + 1);
// }

// const checkConsecutive = (number, array) => {
//     if (array.includes(number + 1) || array.includes(number-1)) {
//         return false;
//     }

//     return true;
// }

// const checkPrimos = (array) => {
//     const found = array.some(r=> primos.indexOf(r) >= 0);

//     return found;
// }

// const checkMasSale = (array) => {
//     const found = array.some(r=> masSalen.indexOf(r) >= 0);

//     return found;
// }

// const checkPares = (array) => {
//     let i = 0;
//     let tempArray = [];

//     do {
//         if(array[i] % 2 == 0) {
//             tempArray.push(array[i]);
//         }
//         i = i + 1;
//     } while (i < 4);

//     return tempArray.length < 3 ? false : true;
// }

// const validarUltimosGanadores = (array, ganadores) => {
//     let result = true;
//     ganadores.forEach(element => {
//         if (element.sort((a,b)=>a-b).toString() == array.sort((a,b)=>a-b).toString()) {
//             result = false;
//         }
//     });

//     return result;
// }

// const generarNumeros = (numerosAyer) => {
//     const {numeros, premiosLotto} = numerosAyer;
//     document.getElementById("ultimo").innerText = `(${numeros.toString().replaceAll(',', ', ')})`;
//     document.getElementById("acumulado").innerText = `${premiosLotto.acumulado} colones`;
//     const array = [];

//     do {
//         let tempNumber = randonNumber();

//         if (!array.includes(tempNumber) && checkConsecutive(tempNumber, array) && !numeros.includes(tempNumber)){
//             array.push(tempNumber);
//         }
//     } while (array.length <= 4);

//     return array.sort((a,b)=>a-b);
// }

// const listarNumeros = async () => {
//     const listNodes = document.getElementById("lista");
//     listNodes.innerHTML = 'Generando';
//     const numerosAyer = await getNumeros();
//     const result = [];
//     const ganadoresUlmimosMeses = numerosAyer.map(e => e.numeros);
//     const cantidad = document.getElementById("cantidad").value;

//     do {
//         let tempArray = generarNumeros(numerosAyer[0]);

//         if (
//             validarExactitud(tempArray) &&
//             validarIzquierda(tempArray) &&
//             (tempArray[2] >= 10) &&
//             checkPrimos(tempArray) &&
//             checkMasSale(tempArray) &&
//             checkPares(tempArray) &&
//             validarUltimosGanadores(tempArray, ganadoresUlmimosMeses)
//         ){
//             result.push(tempArray.sort((a,b)=>a-b));
//         }
//     } while (result.length <= (cantidad - 1));

//     listNodes.innerHTML = '';

//     result.forEach(e => {
//         let li = document.createElement('li');
//         let p = document.createElement('p');

//         p.innerText = `(${e.toString().replaceAll(',', ', ')})`;
//         li.appendChild(p);
//         listNodes.appendChild(li);
//     });

// }
