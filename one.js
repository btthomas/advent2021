import { readFile } from 'fs/promises';

// 1a
// async function init() {
//   const input = await readFile('one.txt', 'utf8');
//   const data = input.split('\n').map((d) => parseInt(d));

//   let last,
//     counter = 0;

//   data.forEach((d) => {
//     if (last) {
//       if (d > last) {
//         counter++;
//       }
//     }
//     last = d;
//   });

//   console.log(counter);
// }

// 1b
async function init() {
  const input = await readFile('one.txt', 'utf8');
  const data = input.split('\n').map((d) => parseInt(d));

  let counter = 0;

  data.forEach((d, i) => {
    if (i > 2) {
      if (d > data[i - 3]) {
        counter++;
      }
    }
  });

  console.log(counter);
}

init();
