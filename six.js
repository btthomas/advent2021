import { readFile } from 'fs/promises';

// 6a
async function init() {
  const input = await readFile('six.test.txt', 'utf8');

  let FISH = input.split(',').reduce(
    (acc, d) => {
      acc[d] += 1;

      return acc;
    },
    { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
  );

  let index = 0;

  while (index < 80) {
    FISH = iterate(FISH);
    index++;
  }
  console.log(FISH);

  console.log(total(FISH));
}

function iterate(FISH) {
  const nextFish = {};
  nextFish[8] = FISH[0] || 0;
  nextFish[6] = FISH[0] || 0;
  for (let i = 1; i <= 8; i++) {
    if (i === 7) {
      nextFish[i - 1] += FISH[i];
    } else {
      nextFish[i - 1] = FISH[i] || 0;
    }
  }
  return nextFish;
}

function total(fish) {
  return Object.keys(fish).reduce((acc, d) => {
    return acc + fish[d];
  }, 0);
}

init();
