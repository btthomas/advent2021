import { readFile } from 'fs/promises';

const ZERO = ['a', 'b', 'c', 'e', 'f', 'g'];
const ONE = ['c', 'f'];
const TWO = ['a', 'c', 'd', 'e', 'g'];
const THREE = ['a', 'c', 'd', 'f', 'g'];
const FOUR = ['b', 'c', 'd', 'f'];
const FIVE = ['a', 'b', 'd', 'f', 'g'];
const SIX = ['a', 'b', 'd', 'e', 'f', 'g'];
const SEVEN = ['a', 'c', 'f'];
const EIGHT = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const NINE = ['a', 'b', 'c', 'd', 'f', 'g'];

const SPECIALS = [ONE, SEVEN, FOUR, EIGHT];

// 8a
async function init() {
  const input = await readFile('eight.test.test.txt', 'utf8');
  const outputs = input.split('\n').map((d) => {
    let [left, right] = d.split('|');
    right = right.trim();
    return right.split(' ');
  });

  // console.log(outputs.join('\n'));
  const sum = outputs.reduce((acc, row) => {
    return acc + count(row);
  }, 0);

  console.log(sum);
}

function count(row) {
  return row.reduce((acc, d) => {
    return acc + SPECIALS.includes(d.length);
  }, 0);
}

init();
