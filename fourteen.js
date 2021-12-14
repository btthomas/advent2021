import { readFile } from 'fs/promises';

// 14a
async function init() {
  console.time('b');
  const input = await readFile('fourteen.txt', 'utf8');
  const lines = input.split('\n');

  let pieces = [];
  let [MOLECULE, blank, ...RULES] = lines;

  RULES = RULES.reduce((acc, rule) => {
    let [match, right] = rule.split(' -> ');
    pieces.push(`(${match})`);
    acc[match] = `${right}${match[1]}`;
    return acc;
  }, {});

  const regexString = pieces.join('|');
  const regex = new RegExp(`(?=(${regexString}))`, 'g');

  for (let i = 0; i < 10; i++) {
    let next = '';
    const matches = MOLECULE.matchAll(regex);
    for (const match of matches) {
      if (next.length === 0) {
        next = match[1][0];
      }
      next += RULES[match[1]];
    }
    MOLECULE = next;
  }

  const scores = [...MOLECULE].reduce((acc, cur) => {
    if (acc[cur]) {
      acc[cur] += 1;
    } else {
      acc[cur] = 1;
    }
    return acc;
  }, {});
  console.log(scores);
}

init();
