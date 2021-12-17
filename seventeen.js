// import { readFile } from 'fs/promises';

// const x1 = 20,
//   x2 = 30,
//   y1 = -5,
//   y2 = -10;

const x1 = 287,
  x2 = 309,
  y1 = -48,
  y2 = -76;

// 17
async function init() {
  // MAX HEIGHT
  //
  // xx is probably going to be a triangular number that fits between the range (ends at 0)
  // 20 <= xi * (xi + 1) / 2  <= 30
  // xi = 6, xx = 20 after 5+ ticks
  // xi = 7, xx = 22 after 4+ ticks, never gets above 30
  //
  // yy has to cross -5/-10 after 4
  // yi = 9, will be at -yi - 1 back at 0 height
  // means (yi + 1) + (yi + 2) has to hit between -y1 and -y2
  // answer is yi * (yi + 1) / 2 for (y2 - 1)

  const possibles = [];
  for (let x = 1; x <= x2; x++) {
    for (let y = y2; y <= 75; y++) {
      if (isValid(x, y)) {
        possibles.push({ x, y });
      }
    }
  }

  console.log(possibles.length);
}

function isValid(x, y) {
  let xx = 0;
  let yy = 0;
  let step = 0;

  while (!passed(xx, yy)) {
    let vx = x - step;
    if (vx < 0) {
      vx = 0;
    }
    const vy = y - step;
    xx += vx;
    yy += vy;

    if (inside(xx, yy)) {
      return true;
    }
    step++;
  }
  return false;
}

function inside(x, y) {
  if (x >= x1 && x <= x2 && y >= y2 && y <= y1) {
    return true;
  }
  return false;
}

function passed(x, y) {
  if (x > x2 || y < y2) {
    return true;
  }
  return false;
}

init();
