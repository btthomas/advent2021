import { readFile } from 'fs/promises';

// 7a
// async function init() {
//   const input = await readFile('seven.txt', 'utf8');

//   const positions = input.split(',').map((d) => parseInt(d));

//   const min = Math.min(...positions);
//   const max = Math.max(...positions);

//   const fuels = [];

//   for (let i = min; i < max; i++) {
//     fuels[i] = calcFuel(positions, i);
//   }

//   const minimum = Math.min(...fuels);
//   const bestI = fuels.indexOf(minimum);

//   console.log(bestI, minimum);
// }

// function calcFuel(positions, i) {
//   return positions.reduce((acc, d) => acc + Math.abs(d - i), 0);
// }

// 7b
async function init() {
  const input = await readFile('seven.txt', 'utf8');

  const positions = input.split(',').map((d) => parseInt(d));

  const min = Math.min(...positions);
  const max = Math.max(...positions);

  const fuels = [];

  for (let i = min; i < max; i++) {
    fuels[i] = calcFuel(positions, i);
  }

  const minimum = Math.min(...fuels);
  const bestI = fuels.indexOf(minimum);

  console.log(bestI, minimum);
}

function calcFuel(positions, i) {
  return positions.reduce((acc, d) => {
    const x = Math.abs(d - i);
    return acc + ((x + 1) * x) / 2;
  }, 0);
}
// 0, 1, 2, 3,  4,  5
// 0, 1, 3, 6, 10, 15

init();
