import { readFile } from 'fs/promises';

// 14a
async function init() {
  const input = await readFile('fourteen.txt', 'utf8');
  const lines = input.split('\n');

  let [MOLECULE, blank, ...RULES] = lines;

  MOLECULE = [...MOLECULE].reduce((acc, cur, ind) => {
    if (ind < MOLECULE.length - 1) {
      const seg = `${cur}${MOLECULE[ind + 1]}`;
      if (acc[seg]) {
        acc[seg]++;
      } else {
        acc[seg] = 1;
      }
    }
    return acc;
  }, {});

  RULES = RULES.reduce((acc, rule) => {
    let [match, right] = rule.split(' -> ');
    acc[match] = [`${match[0]}${right}`, `${right}${match[1]}`];
    return acc;
  }, {});

  for (let i = 0; i < 40; i++) {
    const next = {};
    for (const [key, value] of Object.entries(MOLECULE)) {
      RULES[key].forEach((seg) => {
        if (next[seg]) {
          next[seg] += value;
        } else {
          next[seg] = value;
        }
      });
    }

    MOLECULE = next;
  }

  const scores = Object.entries(MOLECULE).reduce(
    (acc, cur) => {
      const [seg, count] = cur;
      const char = seg[1];
      if (acc[char]) {
        acc[char] += count;
      } else {
        acc[char] = count;
      }

      return acc;
    },
    { [lines[0][0]]: 1 }
  );
  console.log(scores);
}

init();
