import { readFile } from 'fs/promises';

// 11a
async function init() {
  const input = await readFile('eleven.txt', 'utf8');

  let grid = input.split('\n').map((line) => {
    return line.split('').map((d) => parseInt(d));
  });
  let total = 0;
  let flashes;
  let step = 0;

  while (true) {
    ({ grid, flashes } = calcNext(grid));
    total += flashes;
    if (flashes === 100) {
      console.log({ step, flashes });
      break;
    }
    step++;
  }
}

function calcNext(grid) {
  let flashes = 0;
  let nextGrid = grid.map((row) =>
    row.map((cell) => ({ val: cell + 1, flashed: false }))
  );

  let done = false;

  while (!done) {
    let oneFlash = false;

    for (let i = 0; i < nextGrid.length; i++) {
      for (let j = 0; j < nextGrid[i].length; j++) {
        const cell = nextGrid[i][j];
        if (!cell.flashed && cell.val > 9) {
          cell.flashed = true;
          flashes++;
          oneFlash = true;

          // propogate flash
          for (let x = i - 1; x <= i + 1; x++) {
            for (let y = j - 1; y <= j + 1; y++) {
              if (!(x === i && y === j)) {
                if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length) {
                  const neighbor = nextGrid[x][y];
                  neighbor.val++;
                }
              }
            }
          }
        }
      }
    }

    done = !oneFlash;
  }

  return {
    flashes,
    grid: nextGrid.map((row) =>
      row.map((cell) => {
        if (cell.val > 9) {
          return 0;
        }
        return cell.val;
      })
    ),
  };
}

init();
