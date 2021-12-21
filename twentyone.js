import { readFile } from 'fs/promises';

// let p1 = 3;
// let p2 = 7;
// let p1Score = 0;
// let p2Score = 0;
// let turns = 0;

// 21a
// async function init() {
//   while ((p1Score < 1000) & (p2Score < 1000)) {
//     turns += 1;
//     const roll = [lastRoll, lastRoll + 1, lastRoll + 2].map(
//       (d) => (d % 1000) + 1
//     );
//     lastRoll = lastRoll + 3;
//     rolls += 3;

//     const sum = roll.reduce((acc, d) => acc + d, 0);
//     if (turns % 2 === 1) {
//       p1 += sum;
//       p1 = p1 % 10;
//       p1Score += p1 + 1;
//     } else {
//       p2 += sum;
//       p2 = p2 % 10;
//       p2Score += p2 + 1;
//     }
//   }
//   console.log({
//     rolls,
//     p1Score,
//     p2Score,
//   });
//   console.log(rolls * p1Score);
//   console.log(rolls * p2Score);
// }

const ROLLS = [
  [1, 1, 1],
  [1, 1, 2],
  [1, 1, 3],
  [1, 2, 1],
  [1, 2, 2],
  [1, 2, 3],
  [1, 3, 1],
  [1, 3, 2],
  [1, 3, 3],
  [2, 1, 1],
  [2, 1, 2],
  [2, 1, 3],
  [2, 2, 1],
  [2, 2, 2],
  [2, 2, 3],
  [2, 3, 1],
  [2, 3, 2],
  [2, 3, 3],
  [3, 1, 1],
  [3, 1, 2],
  [3, 1, 3],
  [3, 2, 1],
  [3, 2, 2],
  [3, 2, 3],
  [3, 3, 1],
  [3, 3, 2],
  [3, 3, 3],
];

const rolls = {};

function rollStats() {
  ROLLS.forEach((roll) => {
    const sum = roll.reduce((acc, d) => acc + d, 0);
    if (rolls[sum]) {
      rolls[sum] += 1;
    } else {
      rolls[sum] = 1;
    }
  });
}
rollStats();
// console.log(rolls);

// 21b
async function init() {
  let worlds = [
    {
      p1: 4,
      p2: 9,
      p1Score: 0,
      p2Score: 0,
      count: 1,
    },
  ];
  let winners = { p1: 0, p2: 0 };

  let turns = 0;
  while (worlds.length > 0 && turns < 20) {
    turns++;
    worlds = rollDice(worlds, turns % 2 === 1);

    // check if worlds are left
    worlds = worlds.filter((world) => {
      if (world.p1Score > 20) {
        winners.p1 += world.count;
        return false;
      }
      if (world.p2Score > 20) {
        winners.p2 += world.count;
        return false;
      }
      return true;
    });
    console.log({ turns, len: worlds.length, winners });
  }
}

function rollDice(worlds, p1Turn) {
  const newWorlds = [];

  worlds.forEach(({ p1, p2, p1Score, p2Score, count }) => {
    for (let roll in rolls) {
      roll = parseInt(roll);
      if (p1Turn) {
        const newP1 = (p1 + roll) % 10;
        const newP1Score = p1Score + newP1 + 1;
        const newCount = count * rolls[roll];

        add(newWorlds, {
          p1: newP1,
          p2,
          p1Score: newP1Score,
          p2Score,
          count: newCount,
        });
      } else {
        const newP2 = (p2 + roll) % 10;
        const newP2Score = p2Score + newP2 + 1;
        const newCount = count * rolls[roll];

        add(newWorlds, {
          p1,
          p2: newP2,
          p1Score,
          p2Score: newP2Score,
          count: newCount,
        });
      }
    }
  });

  return newWorlds;
}

function add(worlds, newWorld) {
  const match = worlds.find((w) => isMatch(w, newWorld));

  if (match) {
    match.count += newWorld.count;
  } else {
    worlds.push(newWorld);
  }
}

function isMatch(w1, w2) {
  if (w1.p1 !== w2.p1) {
    return false;
  }
  if (w1.p2 !== w2.p2) {
    return false;
  }
  if (w1.p1Score !== w2.p1Score) {
    return false;
  }
  if (w1.p2Score !== w2.p2Score) {
    return false;
  }
  return true;
}

init();
