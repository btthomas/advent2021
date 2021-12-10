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

const LEFTOVER = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
};

async function init() {
  const input = await readFile('ten.txt', 'utf8');

  const rows = input.split('\n');

  let score = 0;
  const scores = [];

  rows.forEach((row) => {
    const stack = [];
    let skip = false;

    for (let i = 0; i < row.length; i++) {
      const d = CLOSERS[row[i]];
      if (d) {
        const top = stack.pop();
        if (top !== d.char) {
          score += d.value;
          skip = true;
          break;
        }
      } else {
        stack.push(row[i]);
      }
    }

    if (!skip && stack.length) {
      const subScore = stack.reduceRight((acc, d) => {
        return acc * 5 + LEFTOVER[d];
      }, 0);
      scores.push(subScore);
    }
  });
  console.log({ score });

  scores.sort((a, b) => a - b);
  console.log({ b: scores[(scores.length - 1) / 2] });
}

init();
