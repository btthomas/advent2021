import { readFile } from 'fs/promises';

let POINTS = [];
const FOLDS = [];

// 13a
async function init() {
  const input = await readFile('thirteen.txt', 'utf8');
  const lines = input.split('\n');

  let folds = false;
  lines.forEach((line) => {
    if (folds) {
      const [a, b, c] = line.split(' ');
      const [dir, pos] = c.split('=');
      FOLDS.push({ dir, pos: parseInt(pos) });
    } else if (line === '') {
      folds = true;
    } else {
      const [x, y] = line.split(',');
      POINTS.push({ x: parseInt(x), y: parseInt(y) });
    }
  });

  FOLDS.forEach((fold) => {
    const { dir, pos } = fold;
    POINTS.forEach((point) => {
      if (point[dir] > pos) {
        point[dir] = 2 * pos - point[dir];
      }
    });

    POINTS = dedupe(POINTS);
    POINTS = parse(POINTS);
  });

  console.log(POINTS);
  const display = [];
  for (let y = 0; y < 6; y++) {
    display[y] = [];
    for (let x = 0; x < 40; x++) {
      display[y][x] = '.';
    }
  }
  POINTS.forEach(({ x, y }) => {
    display[y][x] = 'X';
  });

  console.log(display.map((row) => row.join('')).join('\n'));
}

function dedupe(POINTS) {
  return Array.from(new Set(POINTS.map(({ x, y }) => `${x},${y}`)));
}

function parse(POINTS) {
  return POINTS.map((line) => {
    const [x, y] = line.split(',');
    return { x: parseInt(x), y: parseInt(y) };
  });
}

init();
