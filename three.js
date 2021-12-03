import { readFile } from 'fs/promises';

async function init() {
  const input = await readFile('three.txt', 'utf8');
  const data = input
    .split('\n')
    .map((d) => d.split('').map((s) => parseInt(s)));

  const len = data.length;

  const sums = data.reduce((acc, d, i) => {
    if (i !== 0) {
      acc.forEach((e, j) => {
        acc[j] += d[j];
      });
    }
    return acc;
  }, data[0]);

  // console.log(len / 2);
  // console.log(sums);

  const gamma = parseInt(sums.map((d) => (d > len / 2 ? 1 : 0)).join(''), 2);
  const epsilon = parseInt(sums.map((d) => (d < len / 2 ? 1 : 0)).join(''), 2);

  console.log({ gamma, epsilon });
  console.log(gamma * epsilon);
}

init();
