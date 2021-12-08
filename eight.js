import { readFile } from 'fs/promises';

// const ZERO  = ['a', 'b', 'c', 'e', 'f', 'g'];
// const ONE   = ['c', 'f'];
// const TWO   = ['a', 'c', 'd', 'e', 'g'];
// const THREE = ['a', 'c', 'd', 'f', 'g'];
// const FOUR  = ['b', 'c', 'd', 'f'];
// const FIVE  = ['a', 'b', 'd', 'f', 'g'];
// const SIX   = ['a', 'b', 'd', 'e', 'f', 'g'];
// const SEVEN = ['a', 'c', 'f'];
// const EIGHT = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
// const NINE  = ['a', 'b', 'c', 'd', 'f', 'g'];

const ZERO = new Set(['a', 'b', 'c', 'e', 'f', 'g']);
const ONE = new Set(['c', 'f']);
const TWO = new Set(['a', 'c', 'd', 'e', 'g']);
const THREE = new Set(['a', 'c', 'd', 'f', 'g']);
const FOUR = new Set(['b', 'c', 'd', 'f']);
const FIVE = new Set(['a', 'b', 'd', 'f', 'g']);
const SIX = new Set(['a', 'b', 'd', 'e', 'f', 'g']);
const SEVEN = new Set(['a', 'c', 'f']);
const EIGHT = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
const NINE = new Set(['a', 'b', 'c', 'd', 'f', 'g']);

// 8a
// async function init() {
//   const input = await readFile('eight.test.test.txt', 'utf8');
//   const outputs = input.split('\n').map((d) => {
//     let [left, right] = d.split('|');
//     right = right.trim();
//     return right.split(' ');
//   });

//   // console.log(outputs.join('\n'));
//   const sum = outputs.reduce((acc, row) => {
//     return acc + count(row);
//   }, 0);

//   console.log(sum);
// }

// function count(row) {
//   return row.reduce((acc, d) => {
//     return acc + SPECIALS.includes(d.length);
//   }, 0);
// }

// 8b
async function init() {
  const input = await readFile('eight.txt', 'utf8');
  const rows = input.split('\n').map((d) => {
    let [left, right] = d.split('|');
    left = left
      .trim()
      .split(' ')
      .map((d) => new Set(d));
    right = right
      .trim()
      .split(' ')
      .map((d) => new Set(d));
    return { left, right };
  });

  let sum = 0;

  rows.forEach((row) => {
    const { left, right } = row;
    const zeros = left.filter((d) => d.size == ZERO.size);
    const one = left.filter((d) => d.size == ONE.size)[0];
    const four = left.filter((d) => d.size == FOUR.size)[0];
    const seven = left.filter((d) => d.size == SEVEN.size)[0];
    const eight = left.filter((d) => d.size == EIGHT.size)[0];

    const A = difference(seven, one);

    const BD = difference(four, one);
    const CDE = findCDE(zeros, eight);

    const D = intersection(BD, CDE);
    const B = difference(BD, D);

    const CF = new Set(one);
    const C = intersection(CF, CDE);
    const F = difference(CF, C);

    const DE = difference(CDE, C);
    const E = difference(DE, D);

    const AEG = difference(eight, four);
    const AG = difference(AEG, E);
    const G = difference(AG, A);

    const zero = difference(eight, D);
    const two = union([A, C, D, E, G]);
    const three = union([seven, D, G]);
    const five = union([A, B, D, F, G]);
    const six = difference(eight, C);
    const nine = difference(eight, E);

    const digits = [zero, one, two, three, four, five, six, seven, eight, nine];

    const output = parseInt(
      right
        .map((d) => digits.findIndex((digit) => setEquals(digit, d)))
        .join('')
    );

    sum += output;
  });

  console.log(sum);
}

function findCDE(zeros, eight) {
  const CDE = new Set();
  zeros.forEach((s) => CDE.add(Array.from(difference(eight, s))[0]));
  return CDE;
}

function setEquals(setA, setB) {
  return intersection(setA, setB).size === union([setA, setB]).size;
}

function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

function union(sets) {
  let _union = new Set(sets[0]);
  sets.forEach((set) => {
    for (let elem of set) {
      _union.add(elem);
    }
  });
  return _union;
}

init();
