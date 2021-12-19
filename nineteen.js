import { readFile } from 'fs/promises';

// 19a
async function init() {
  // console.time('0');
  const input = await readFile('nineteen.test.txt', 'utf8');
}

init();
