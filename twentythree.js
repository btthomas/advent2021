const HALLWAY = '...........';
const SPOTS = [0, 1, 3, 5, 7, 9, 10];
const A = 'A';
const B = 'B';
const C = 'C';
const D = 'D';
const costA = 1;
const costB = 10;
const costC = 100;
const costD = 1000;

// const startingBoard = {
//   hallway: HALLWAY,
//   a: 'BA',
//   b: 'CD',
//   c: 'BC',
//   d: 'DA',
// };

const startingBoard = {
  hallway: 'AC.......BD',
  A: '.A',
  B: '.B',
  C: '.C',
  D: '.D',
};

let bestScores = {};
let bestScore = 9999999999;

// 23
async function init() {
  tryNext(startingBoard, 0);

  console.log(bestScore);
}

function tryNext(board, score) {
  // console.log(serialize(board));
  // console.log(score);
  // "memoize" this position and stop searching if we aren't any better
  const prevScore = bestScores[serialize(board)];
  if (prevScore && prevScore <= score) {
    // console.log(score);
    // we got here more efficiently, so quit looking
    return;
  }
  bestScores[serialize(board)] = score;

  // if we are done, check if we beat the previous best
  if (isDone(board)) {
    console.log('done', score);
    if (score < bestScore) {
      bestScore = score;
    }
    return;
  }

  // if an animal is "available" and can go home directly, do it to the bottom available
  const scorePaths = findScorePaths(board, score);
  if (scorePaths.length) {
    scorePaths.forEach(({ newBoard, newScore }) => {
      tryNext(newBoard, newScore);
    });
    return;
  }
  // move an animal to a "safe spot" in the hall way
  const movePaths = findMovePaths(board);
  for (let i = 0; i < movePaths.length; i++) {
    tryNext(newBoard, newScore);
    return;
  }

  // no valid moves!
  return;
}

const ORDER = 'DCBA';

function findScorePaths(board, score) {
  const { hallway } = board;
  const paths = [];
  for (let i = 0; i < ORDER.length; i++) {
    const letter = ORDER[i];
    const spot = isOpen(board, letter);
    if (spot) {
      // check hallway and top
      if (letter === A) {
        const a = spot === 2 ? '.A' : 'AA';

        if (hallway[1] === A) {
          const newHallway = change(hallway, 1, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 1 + spot,
          });
        }
        if (hallway[1] === '.' && hallway[0] === A) {
          const newHallway = change(hallway, 0, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 2 + spot,
          });
        }
        if (hallway[3] === A) {
          const newHallway = change(hallway, 3, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 1 + spot,
          });
        }
        if (hallway[3] === '.' && hallway[5] === A) {
          const newHallway = change(hallway, 5, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 3 + spot,
          });
        }
        if (hallway[3] === '.' && hallway[5] === '.' && hallway[7] === A) {
          const newHallway = change(hallway, 7, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 5 + spot,
          });
        }
        if (
          hallway[3] === '.' &&
          hallway[5] === '.' &&
          hallway[7] === '.' &&
          hallway[9] === A
        ) {
          const newHallway = change(hallway, 9, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 7 + spot,
          });
        }
        if (
          hallway[3] === '.' &&
          hallway[5] === '.' &&
          hallway[7] === '.' &&
          hallway[9] === '.' &&
          hallway[10] === A
        ) {
          const newHallway = change(hallway, 10, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 8 + spot,
          });
        }
      }
      if (letter === B) {
        const b = spot === 2 ? '.B' : 'BB';

        if (hallway[3] === B) {
          const newHallway = change(hallway, 3, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (1 + spot),
          });
        }
        if (hallway[5] === B) {
          const newHallway = change(hallway, 5, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (1 + spot),
          });
        }
        if (hallway[1] === B && hallway[3] === '.') {
          const newHallway = change(hallway, 1, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (3 + spot),
          });
        }
        if (hallway[0] === B && hallway[1] === '.' && hallway[3] === '.') {
          const newHallway = change(hallway, 1, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (4 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[7] === B) {
          const newHallway = change(hallway, 7, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (3 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[7] === '.' && hallway[9] === B) {
          const newHallway = change(hallway, 9, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (5 + spot),
          });
        }
        if (
          hallway[5] === '.' &&
          hallway[7] === '.' &&
          hallway[9] === '.' &&
          hallway[10] === B
        ) {
          const newHallway = change(hallway, 10, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (6 + spot),
          });
        }
      }
      if (letter === C) {
        const c = spot === 2 ? '.C' : 'CC';

        if (hallway[5] === C) {
          const newHallway = change(hallway, 5, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (1 + spot),
          });
        }
        if (hallway[7] === C) {
          const newHallway = change(hallway, 7, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (1 + spot),
          });
        }
        if (hallway[9] === C && hallway[7] === '.') {
          const newHallway = change(hallway, 9, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (3 + spot),
          });
        }
        if (hallway[10] === C && hallway[9] === '.' && hallway[7] === '.') {
          const newHallway = change(hallway, 10, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (4 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[3] === C) {
          const newHallway = change(hallway, 3, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (3 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[3] === '.' && hallway[1] === C) {
          const newHallway = change(hallway, 1, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (5 + spot),
          });
        }
        if (
          hallway[5] === '.' &&
          hallway[3] === '.' &&
          hallway[1] === '.' &&
          hallway[0] === C
        ) {
          const newHallway = change(hallway, 0, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (6 + spot),
          });
        }
      }
      if (letter === D) {
        const d = spot === 2 ? '.D' : 'DD';
        if (hallway[9] === D) {
          const newHallway = change(hallway, 9, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (1 + spot),
          });
        }
        if (hallway[9] === '.' && hallway[10] === D) {
          const newHallway = change(hallway, 10, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (2 + spot),
          });
        }
        if (hallway[7] === D) {
          const newHallway = change(hallway, 7, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (1 + spot),
          });
        }
        if (hallway[7] === '.' && hallway[5] === D) {
          const newHallway = change(hallway, 5, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (3 + spot),
          });
        }
        if (hallway[7] === '.' && hallway[5] === '.' && hallway[3] === D) {
          const newHallway = change(hallway, 3, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (5 + spot),
          });
        }
        if (
          hallway[3] === '.' &&
          hallway[5] === '.' &&
          hallway[7] === '.' &&
          hallway[1] === D
        ) {
          const newHallway = change(hallway, 1, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (7 + spot),
          });
        }
        if (
          hallway[3] === '.' &&
          hallway[5] === '.' &&
          hallway[7] === '.' &&
          hallway[1] === '.' &&
          hallway[0] === D
        ) {
          const newHallway = change(hallway, 0, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (8 + spot),
          });
        }
      }
    }
  }

  return paths;
}

function findMovePaths() {
  return [];
}

function isOpen(board, letter) {
  if (board[letter] === '..') {
    return 2;
  }
  if (board[letter] === `.${letter}`) {
    return 1;
  }
  return 0;
}

function isDone(board) {
  if (board.hallway !== HALLWAY) {
    return false;
  }
  if (board.A != 'AA') {
    return false;
  }
  if (board.B != 'BB') {
    return false;
  }
  if (board.C != 'CC') {
    return false;
  }
  if (board.D != 'DD') {
    return false;
  }
  return true;
}

function print(board) {
  console.log(serialize(board));
}

function serialize(board) {
  return [board.hallway, board.A, board.B, board.C, board.D].join(',');
}

function change(string, i, ch) {
  return string.substring(0, i) + ch + string.substring(i + 1);
}

init();
