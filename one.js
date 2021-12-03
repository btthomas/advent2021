import { readFile } from 'fs/promises';

async function init() {
  const input = await readFile('one.txt', 'utf8');
  const data = input.split('\n').map((d) => parseInt(d));

  let last,
    counter = 0;

  data.forEach((d, i) => {
    if (last) {
      if (d > last) {
        counter++;
      }
    }
    last = d;
  });

  console.log(counter);
}

init();
