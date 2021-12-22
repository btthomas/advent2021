import { readFile } from 'fs/promises';

const world = [];
for (let i = 0; i < 101; i++) {
  world[i] = [];
  for (let j = 0; j < 101; j++) {
    world[i][j] = [];
    for (let k = 0; k < 101; k++) {
      world[i][j][k] = 0;
    }
  }
}

const ON = 'on';
const OFF = 'off';

// 22
async function init() {
  const input = await readFile('twentytwo.txt', 'utf8');
  const lines = input.split('\n');

  lines.forEach((line) => {
    const [dir, space] = line.split(' ');
    const [xx, yy, zz] = space.split(',');
    const [_x, xRange] = xx.split('=');
    const [_y, yRange] = yy.split('=');
    const [_z, zRange] = zz.split('=');

    const [x1, x2] = xRange.split('..').map((d) => parseInt(d));
    const [y1, y2] = yRange.split('..').map((d) => parseInt(d));
    const [z1, z2] = zRange.split('..').map((d) => parseInt(d));

    console.log({ dir, x1, x2, y1, y2, z1, z2 });

    for (let i = x1; i <= x2; i++) {
      if (i >= -50 && i <= 50) {
        for (let j = y1; j <= y2; j++) {
          if (j >= -50 && j <= 50) {
            for (let k = z1; k <= z2; k++) {
              if (k >= -50 && k <= 50) {
                if (dir === ON) {
                  world[i + 50][j + 50][k + 50] = 1;
                } else {
                  world[i + 50][j + 50][k + 50] = 0;
                }
              }
            }
          }
        }
      }
    }
  });

  const sum = world.reduce(
    (acc, d) => acc + d.reduce((ac, e) => ac + e.reduce((a, f) => a + f, 0), 0),
    0
  );

  console.log(sum);
}

init();
