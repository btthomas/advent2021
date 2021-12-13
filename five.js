import { readFile } from 'fs/promises';

// 5a
// async function init() {
//   const BOARD = [];
//   const LINES = [];

//   const input = await readFile('five.txt', 'utf8');
//   const rows = input.split('\n');

//   let max = 0;
//   rows.forEach((row) => {
//     const [left, right] = row.split(' -> ');
//     let [x1, y1] = left.split(',').map((d) => parseInt(d));
//     let [x2, y2] = right.split(',').map((d) => parseInt(d));

//     if (x1 > max) {
//       max = x1;
//     }
//     if (x2 > max) {
//       max = x2;
//     }
//     if (y1 > max) {
//       max = y1;
//     }
//     if (y2 > max) {
//       max = y2;
//     }

//     LINES.push({
//       x1,
//       y1,
//       x2,
//       y2,
//     });
//   });

//   for (let i = 0; i < max + 1; i++) {
//     BOARD.push([]);
//     for (let j = 0; j < max + 1; j++) {
//       BOARD[i][j] = 0;
//     }
//   }

//   LINES.forEach(({ x1, y1, x2, y2 }) => {
//     const isH = y1 === y2;
//     const isV = x1 === x2;

//     if (isH) {
//       if (x1 > x2) {
//         let swap = x1;
//         x1 = x2;
//         x2 = swap;
//       }

//       for (let xx = x1; xx <= x2; xx++) {
//         BOARD[xx][y1] += 1;
//       }
//     }
//     if (isV) {
//       if (y1 > y2) {
//         let swap = y1;
//         y1 = y2;
//         y2 = swap;
//       }

//       for (let yy = y1; yy <= y2; yy++) {
//         BOARD[x1][yy] += 1;
//       }
//     }
//   });

//   let counter = 0;
//   BOARD.forEach((row) => {
//     row.forEach((cell) => {
//       if (cell > 1) {
//         counter++;
//       }
//     });
//   });
//   // console.log(BOARD.join('\n'));
//   console.log(counter);
// }

// 5b
async function init() {
  console.time('b');
  const BOARD = [];
  const LINES = [];

  const input = await readFile('five.txt', 'utf8');
  const rows = input.split('\n');

  let max = 0;
  rows.forEach((row) => {
    const [left, right] = row.split(' -> ');
    let [x1, y1] = left.split(',').map((d) => parseInt(d));
    let [x2, y2] = right.split(',').map((d) => parseInt(d));

    if (x1 > max) {
      max = x1;
    }
    if (x2 > max) {
      max = x2;
    }
    if (y1 > max) {
      max = y1;
    }
    if (y2 > max) {
      max = y2;
    }

    LINES.push({
      x1,
      y1,
      x2,
      y2,
    });
  });

  for (let i = 0; i < max + 1; i++) {
    BOARD.push([]);
    for (let j = 0; j < max + 1; j++) {
      BOARD[i][j] = 0;
    }
  }

  LINES.forEach(({ x1, y1, x2, y2 }) => {
    const isH = y1 === y2;
    const isV = x1 === x2;

    if (isH) {
      if (x1 > x2) {
        let swap = x1;
        x1 = x2;
        x2 = swap;
      }

      for (let xx = x1; xx <= x2; xx++) {
        BOARD[xx][y1] += 1;
      }
    } else if (isV) {
      if (y1 > y2) {
        let swap = y1;
        y1 = y2;
        y2 = swap;
      }

      for (let yy = y1; yy <= y2; yy++) {
        BOARD[x1][yy] += 1;
      }
    } else {
      // diagonal
      if (x1 > x2) {
        let swapX = x1;
        let swapY = y1;
        x1 = x2;
        y1 = y2;
        x2 = swapX;
        y2 = swapY;
      }

      const dY = y1 < y2 ? 1 : -1;
      let yy = y1;
      for (let xx = x1; xx <= x2; xx++) {
        BOARD[xx][yy] += 1;
        yy += dY;
      }
    }
  });

  let counter = 0;
  BOARD.forEach((row) => {
    row.forEach((cell) => {
      if (cell > 1) {
        counter++;
      }
    });
  });
  // console.log(BOARD.join('\n'));
  console.log(counter);

  console.timeEnd('b');
}

init();
