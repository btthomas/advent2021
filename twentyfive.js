import { readFile } from 'fs/promises';

let grid = [];
// 25
async function init() {
  const input = await readFile('twentyfive.txt', 'utf8');

  grid = input.split('\n').map((line) => line.split(''));

  // console.log(grid.join('\n'));
  let i = 0;
  while (true) {
    let movers = 0;
    let nextGrid = freshGrid(grid);

    // check rights
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '>') {
          const xx = (x + 1) % grid[0].length;
          if (grid[y][xx] === '.') {
            nextGrid[y][xx] = '>';
            movers++;
          } else {
            nextGrid[y][x] = '>';
          }
        } else if (grid[y][x] === 'v') {
          nextGrid[y][x] = 'v';
        }
      }
    }

    grid = copy(nextGrid);
    // console.log(movers);
    // console.log(grid.join('\n'));

    nextGrid = freshGrid(grid);

    // check downs
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === 'v') {
          const yy = (y + 1) % grid.length;
          if (grid[yy][x] === '.') {
            nextGrid[yy][x] = 'v';
            movers++;
          } else {
            nextGrid[y][x] = 'v';
          }
        } else if (grid[y][x] === '>') {
          nextGrid[y][x] = '>';
        }
      }
    }

    grid = copy(nextGrid);
    i++;
    // console.log({ i, movers });
    // console.log(grid.join('\n'));
    if (movers === 0) {
      console.log({ i });
      break;
    }
  }
}

function copy(grid) {
  return grid.map((row) => row.map((d) => d));
}

function freshGrid(grid) {
  const g = [];
  for (let y = 0; y < grid.length; y++) {
    g[y] = [];
    for (let x = 0; x < grid[0].length; x++) {
      g[y][x] = '.';
    }
  }
  return g;
}

init();
