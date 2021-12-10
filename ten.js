import { readFile } from 'fs/promises';

const CLOSERS = {
  ')': {
    char: '(',
    value: 3,
  },
  ']': {
    char: '[',
    value: 57,
  },
  '}': {
    char: '{',
    value: 1197,
  },
  '>': {
    char: '<',
    value: 25137,
  },
};

async function init() {
  const input = await readFile('ten.test.txt', 'utf8');

  const rows = input.split('\n');

  let score = 0;

  rows.forEach((row) => {
    const stack = [];

    for (let i = 0; i < row.length; i++) {
      const d = CLOSERS[row[i]];
      if (d) {
        const top = stack.pop();
        if (top !== d.char) {
          score += d.value;
          break;
        }
      } else {
        stack.push(row[i]);
      }
    }
  });
  console.log(score);
}

init();
