import { readFile } from 'fs/promises';

async function init() {
  const input = await readFile('nine.txt', 'utf8');

  const MATRIX = input.split('\n').map((line) => {
    return line.split('').map((d) => parseInt(d));
  });

  const lowPoints = [];

  MATRIX.forEach((row, i) => {
    row.forEach((d, j) => {
      if (isLow(MATRIX, i, j)) {
        lowPoints.push({
          i,
          j,
          d,
        });
      }
    });
  });

  const basins = lowPoints.map(({ i, j, d }) => {
    const basin = new Set();

    addToBasin(MATRIX, basin, i, j);

    return { i, j, size: basin.size };
  });

  basins.sort((a, b) => b.size - a.size);
  console.log(basins[0].size * basins[1].size * basins[2].size);
}

function addToBasin(grid, basin, i, j) {
  if (!inside(grid, i, j)) {
    return;
  }

  if (grid[i][j] === 9) {
    return;
  }

  const point = `${i}-${j}`;
  if (basin.has(point)) {
    return;
  }
  basin.add(point);

  // add neighbors;
  addToBasin(grid, basin, i - 1, j);
  addToBasin(grid, basin, i + 1, j);
  addToBasin(grid, basin, i, j - 1);
  addToBasin(grid, basin, i, j + 1);
}

function inside(grid, x, y) {
  if (x < 0) {
    return false;
  }
  if (x === grid.length) {
    return false;
  }
  if (y < 0) {
    return false;
  }
  if (y === grid[0].length) {
    return false;
  }
  return true;
}

function isLow(grid, i, j) {
  const neighbors = [];

  if (inside(grid, i - 1, j)) {
    neighbors.push(grid[i - 1][j]);
  }
  if (inside(grid, i, j - 1)) {
    neighbors.push(grid[i][j - 1]);
  }
  if (inside(grid, i, j + 1)) {
    neighbors.push(grid[i][j + 1]);
  }
  if (inside(grid, i + 1, j)) {
    neighbors.push(grid[i + 1][j]);
  }

  for (let ind = 0; ind < neighbors.length; ind++) {
    if (grid[i][j] >= neighbors[ind]) {
      return false;
    }
  }

  return true;
}

init();
