import { readFile } from 'fs/promises';

// 3a
// async function init() {
//   const input = await readFile('three.txt', 'utf8');
//   const data = input
//     .split('\n')
//     .map((d) => d.split('').map((s) => parseInt(s)));

//   const len = data.length;

//   const sums = data.reduce((acc, d, i) => {
//     if (i !== 0) {
//       acc.forEach((e, j) => {
//         acc[j] += d[j];
//       });
//     }
//     return acc;
//   }, data[0]);

//   // console.log(len / 2);
//   // console.log(sums);

//   const gamma = parseInt(sums.map((d) => (d > len / 2 ? 1 : 0)).join(''), 2);
//   const epsilon = parseInt(sums.map((d) => (d < len / 2 ? 1 : 0)).join(''), 2);

//   console.log({ gamma, epsilon });
//   console.log(gamma * epsilon);
// }

// 3b
function calcGamma(list, bit) {
  const len = list.length;
  const sum = list.reduce((acc, d) => acc + d[bit], 0);

  return sum >= len / 2 ? 1 : 0;
}
function calcEpsilon(list, bit) {
  const len = list.length;
  const sum = list.reduce((acc, d) => acc + d[bit], 0);

  return sum < len / 2 ? 1 : 0;
}

async function init() {
  const input = await readFile('three.txt', 'utf8');
  const data = input
    .split('\n')
    .map((d) => d.split('').map((s) => parseInt(s)));

  let ox = [...data];
  let index = 0;
  while (ox.length > 1 && index < data[0].length) {
    const gamma = calcGamma(ox, index);
    ox = ox.filter((d) => d[index] === gamma);
    index++;
  }

  let co2 = [...data];
  index = 0;
  while (co2.length > 1 && index < data[0].length) {
    const epsilon = calcEpsilon(co2, index);
    co2 = co2.filter((d) => d[index] === epsilon);
    index++;
  }

  ox = parseInt(ox[0].join(''), 2);
  co2 = parseInt(co2[0].join(''), 2);

  console.log({ ox, co2, abc: ox * co2 });
}

init();
