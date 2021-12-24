import { readFile } from 'fs/promises';

async function init() {
  const input = await readFile('twentyfour.txt', 'utf8');
  const codes = input.split('\n');

  let modelNumber = [...'13579246899999'].map((d) => parseInt(d)).reverse();
  console.log(modelNumber);

  const registers = { w: 0, x: 0, y: 0, z: 0 };

  codes.forEach((line) => {
    let [act, a, b] = line.split(' ');

    if (act === 'inp') {
      registers[a] = modelNumber.pop();
    } else {
      if ('wxyz'.includes(b)) {
        b = registers[b];
      } else {
        b = parseInt(b);
      }

      if (act === 'add') {
        registers[a] += b;
      } else if (act === 'mul') {
        registers[a] *= b;
      } else if (act === 'div') {
        const result = registers[a] / b;
        if (result > 0) {
          registers[a] = Math.floor(result);
        } else {
          registers[a] = Math.ceil(result);
        }
      } else if (act === 'mod') {
        registers[a] = registers[a] % b;
      } else if (act === 'eql') {
        registers[a] = registers[a] === b ? 1 : 0;
      }
    }
    console.log(registers);
  });
}

init();
