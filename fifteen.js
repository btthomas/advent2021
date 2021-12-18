import { readFile } from 'fs/promises';

let MAP = [];
let BEST;
let BEST2;

// 15a
async function init() {
  console.time('0');

  const input = await readFile('fifteen.txt', 'utf8');
  const piece = input
    .split('\n')
    .map((line) => line.split('').map((d) => parseInt(d)));

  buildMap(piece);

  BEST = MAP.map((line) => line.map(() => -1));
  console.timeEnd('0');

  console.time('a');
  console.time('b');

  // kick it off with right and down
  BEST[0][0] = 0;
  tryNext1({ x: 0, y: 0 }, 1, 0);
  tryNext1({ x: 0, y: 0 }, 0, 1);
  console.log(BEST[BEST.length - 1][BEST[0].length - 1]);
  console.timeEnd('a');

  // re-run it and allow zigzag
  BEST2 = MAP.map((line) => line.map(() => -1));
  BEST2[0][0] = 0;
  tryNext2({ x: 0, y: 0 }, 1, 0);
  tryNext2({ x: 0, y: 0 }, 0, 1);

  console.log(BEST2[BEST.length - 1][BEST[0].length - 1]);
  console.timeEnd('b');
}

function buildMap(piece) {
  const length = piece.length;

  for (let i = 0; i < 5; i++) {
    for (let x = 0; x < length; x++) {
      const xx = i * length + x;
      MAP[xx] = [];
      for (let j = 0; j < 5; j++) {
        for (let y = 0; y < length; y++) {
          const yy = j * length + y;

          let val = piece[x][y] + i + j;
          if (val > 9) {
            val -= 9;
          }
          if (val > 9) {
            val -= 9;
          }

          MAP[xx][yy] = val;
        }
      }
    }
  }
}

function tryNext1(currentNode, a, b) {
  const { x, y } = currentNode;

  const lastScore = BEST[x][y];

  const nextScore = lastScore + MAP[a][b];

  if (BEST[a][b] === -1 || BEST[a][b] > nextScore) {
    BEST[a][b] = nextScore;
    // right
    if (a + 1 < MAP.length) {
      tryNext1({ x: a, y: b }, a + 1, b);
    }
    // down
    if (b + 1 < MAP[0].length) {
      tryNext1({ x: a, y: b }, a, b + 1);
    }
  }
}

function tryNext2(currentNode, a, b) {
  const { x, y } = currentNode;

  const lastScore = BEST2[x][y];

  const nextScore = lastScore + MAP[a][b];

  if (
    (BEST2[a][b] === -1 && nextScore <= BEST[a][b]) ||
    BEST2[a][b] > nextScore
  ) {
    BEST2[a][b] = nextScore;

    // up
    if (b - 1 >= 0) {
      tryNext2({ x: a, y: b }, a, b - 1);
    }
    // left
    if (a - 1 >= 0) {
      tryNext2({ x: a, y: b }, a - 1, b);
    }

    // right
    if (a + 1 < MAP.length) {
      tryNext2({ x: a, y: b }, a + 1, b);
    }
    // down
    if (b + 1 < MAP[0].length) {
      tryNext2({ x: a, y: b }, a, b + 1);
    }
  }
}

init();
