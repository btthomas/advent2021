import { readFile } from 'fs/promises';

const F = 'forward';
const D = 'down';
const U = 'up';

// 2a
// async function init() {
//   const input = await readFile('two.txt', 'utf8');
//   const data = input.split('\n');

//   let h = 0,
//     d = 0;

//   data.forEach((s) => {
//     let [dir, x] = s.split(' ');
//     x = parseInt(x);
//     console.log(dir, x);
//     switch (dir) {
//       case F:
//         h += x;
//         break;
//       case D:
//         d += x;
//         break;
//       case U:
//         d -= x;
//         break;
//     }
//     console.log({ h, d });
//   });

//   console.log(h * d);
// }

// 2b
async function init() {
  const input = await readFile('two.txt', 'utf8');
  const data = input.split('\n');

  let h = 0,
    d = 0,
    aim = 0;

  data.forEach((s) => {
    let [dir, x] = s.split(' ');
    x = parseInt(x);
    console.log(dir, x);
    switch (dir) {
      case F:
        h += x;
        d += aim * x;
        break;
      case D:
        aim += x;
        break;
      case U:
        aim -= x;
        break;
    }
    console.log({ h, d });
  });

  console.log(h * d);
}

init();
