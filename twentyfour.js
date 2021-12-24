import { readFile } from 'fs/promises';

let codes;

async function init() {
  const input = await readFile('twentyfour.txt', 'utf8');
  codes = input.split('\n');

  // a
  // const i = 9;
  // const j = 6;
  // const k = 9;
  // const l = k - 2;
  // const m = 9;
  // const n = 9;
  // const o = n - 1;
  // const p = 9;
  // const q = p - 3;
  // const a = 9;
  // const b = a - 7;
  // const c = m - 5;
  // const d = j + 3;
  // const e = i - 4;

  // b
  const i = 5;
  const j = 1;
  const k = 3;
  const l = k - 2;
  const m = 6;
  const n = 2;
  const o = n - 1;
  const p = 4;
  const q = p - 3;
  const a = 8;
  const b = a - 7;
  const c = m - 5;
  const d = j + 3;
  const e = i - 4;

  const { z } = test([i, j, k, l, m, n, o, p, q, a, b, c, d, e], codes);

  console.log({
    z,
    num: [i, j, k, l, m, n, o, p, q, a, b, c, d, e].join(''),
  });
}

function test(modelNumber, codes) {
  const registers = { w: 0, x: 0, y: 0, z: 0 };

  codes.forEach((line) => {
    let [act, a, b] = line.split(' ');

    if (act === 'inp') {
      registers[a] = modelNumber.shift();
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
  });
  return registers;
}

function combineInstructions(code) {
  let inputCount = 0;
  const registers = { w: '0', x: '0', y: '0', z: '0' };

  codes.forEach((code) => {
    let [act, a, b] = code.split(' ');

    if (act === 'inp') {
      registers[a] = `inp_${inputCount++}`;
    } else {
      if ('wxyz'.includes(b)) {
        b = registers[b];
      }

      const A0 = registers[a] === '0';
      const B0 = b === '0';

      if (act === 'add') {
        if (B0) {
          // nothing
        } else if (A0) {
          registers[a] = b;
        } else {
          registers[a] = `(${registers[a]} + ${b})`;
        }
      } else if (act === 'mul') {
        if (B0) {
          registers[a] = '0';
        } else if (A0) {
          // nothing
        } else {
          registers[a] = `(${registers[a]} * ${b})`;
        }
      } else if (act === 'div') {
        if (B0) {
          // BREAK!
          throw new Error(`b is 0, ${code}, ${i}`);
        } else if (A0) {
          // nothing
        } else {
          registers[a] = `(${registers[a]}) / (${b})`;
        }
      } else if (act === 'mod') {
        if (B0) {
          // BREAK!
          throw new Error(`b is 0, ${code}, ${i}`);
        } else if (A0) {
          // nothing
        } else {
          registers[a] = `(${registers[a]}) % (${b})`;
        }
      } else if (act === 'eql') {
        registers[a] = `(${registers[a]}) == (${b})`;
      }
    }
    console.log(registers.z.length);
  });
  console.log(registers);
}

function testAll() {
  // for (let i = 99999999999999; i > 0; i--) {
  for (let i = 11111111111111; i < 100000000000000; i++) {
    if (i % 10000000 === 0) {
      console.log(i);
    }

    let modelNumber = `${i}`;
    if (modelNumber.includes('0')) {
      continue;
    }
    modelNumber = [...modelNumber].map((d) => parseInt(d));

    try {
      if (test(modelNumber)) {
        console.log(i);
        break;
      }
    } catch {}
  }
}

init();
