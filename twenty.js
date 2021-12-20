import { readFile } from 'fs/promises';

let LOOKUP;

// 20
async function init() {
  const input = await readFile('twenty.txt', 'utf8');

  const [algo, blank, ...grid] = input.split('\n');

  calculateLookup(algo);

  let image = grid.map((row) => [...row].map(parseFunc));

  for (let i = 0; i < 50; i++) {
    image = enhance(image, i % 2 === 1);
  }

  const sum = image.flat().reduce((acc, d) => acc + d, 0);

  console.log(sum);
}

function enhance(grid, odd) {
  const newGrid = [];
  let num = [];
  for (let i = -1; i < grid.length + 1; i++) {
    newGrid[i + 1] = [];
    for (let j = -1; j < grid[0].length + 1; j++) {
      num = [];
      for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
          num.push(grid?.[x]?.[y] ?? (odd ? 1 : 0));
        }
      }
      const score = parseInt(num.join(''), 2);
      const val = LOOKUP[score];
      // console.log({ i, j, score, val });
      newGrid[i + 1][j + 1] = val;
    }
  }
  return newGrid;
}

function calculateLookup(algo) {
  LOOKUP = algo.split('').map(parseFunc);
}

function parseFunc(cell) {
  return cell === '#' ? 1 : 0;
}

init();
