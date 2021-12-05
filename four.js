import { readFile } from 'fs/promises';

const EMPTY_ROW = '';

function isSuperset(set, subset) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

async function init() {
  const input = await readFile('four.txt', 'utf8');

  const [rawNumbers, ...rawBoards] = input.split('\n');

  const numbers = rawNumbers.split(',').map((d) => parseInt(d));

  const boards = [];
  let nextBoard = [];

  rawBoards.forEach((rawRow, index) => {
    if (rawRow === EMPTY_ROW) {
      if (index !== 0) {
        boards.push(nextBoard);
      }
      nextBoard = [];
    } else {
      const row = rawRow
        .split(' ')
        .filter((d) => d)
        .map((d) => parseInt(d));

      nextBoard.push(row);
    }
  });
  boards.push(nextBoard);

  const boardSets = boards.map((b) => {
    // rows
    const sets = b.map((b) => new Set(b));
    // cols
    for (let i = 0; i < 5; i++) {
      sets.push(new Set([b[0][i], b[1][i], b[2][i], b[3][i], b[4][i]]));
    }
    return sets;
  });

  let numIndex = 0;
  const pSet = new Set();
  let found = -1;
  let last;

  while (numIndex < numbers.length) {
    last = numbers[numIndex];
    pSet.add(last);

    boardSets.forEach((sets, boardI) => {
      sets.forEach((set) => {
        if (isSuperset(pSet, set)) {
          found = boardI;
        }
      });
    });

    if (found === -1) {
      numIndex++;
    } else {
      break;
    }
  }

  console.log(pSet);
  const winning = boards[found].flat();
  console.log(winning);

  const sum = winning.reduce((acc, d) => {
    if (!pSet.has(d)) {
      acc += d;
    }
    return acc;
  }, 0);

  console.log(sum, last, sum * last);
}

try {
  init();
} catch (e) {
  console.error(e);
}
