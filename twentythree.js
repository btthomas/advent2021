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
const ORDER = 'DCBA';

function cost(letter) {
  if (letter === A) {
    return costA;
  }
  if (letter === B) {
    return costB;
  }
  if (letter === C) {
    return costC;
  }
  if (letter === D) {
    return costD;
  }
}

// const startingBoard = {
//   hallway: 'AB.......CD',
//   A: '.AAA',
//   B: '.BBB',
//   C: '.CCC',
//   D: '.DDD',
// };

const startingBoard = {
  hallway: '...........',
  A: 'DDDC',
  B: 'ACBC',
  C: 'ABAB',
  D: 'DACB',
};

let bestScores = {};
let bestScore = 9999999999;

// 23
async function init() {
  console.log(serialize(startingBoard));
  tryNext(startingBoard, 0);

  console.log(bestScore);
}

function tryNext(board, score, moves = []) {
  // console.log(serialize(board));
  // console.log(score);
  // memoize this position and stop searching if we aren't any better
  const prevScore = bestScores[serialize(board)];
  if (prevScore && prevScore <= score) {
    // console.log(score);
    // we got here more efficiently, so quit looking
    return;
  }
  bestScores[serialize(board)] = score;

  // if we are done, check if we beat the previous best
  if (isDone(board)) {
    if (score < bestScore) {
      bestScore = score;
      console.log('done', score);
      console.log(moves.map((d) => serialize(d)).join('\n'));
      console.log('');
    }
    return;
  }

  // if an animal is "available" and can go home directly, do it to the bottom available
  const scorePaths = findScorePaths(board, score);
  if (scorePaths.length) {
    // console.log({ score: scorePaths.length });
    scorePaths.forEach(({ newBoard, newScore }) => {
      tryNext(newBoard, newScore, [...moves, newBoard]);
    });
    // return;
  }
  // move an animal to a "safe spot" in the hall way
  const movePaths = findMovePaths(board, score);
  if (movePaths.length) {
    // console.log({ move: movePaths.length });
    movePaths.forEach(({ newBoard, newScore }) => {
      tryNext(newBoard, newScore, [...moves, newBoard]);
    });
  }

  return;
}

function findScorePaths(board, score) {
  const { hallway } = board;
  const paths = [];
  for (let i = 0; i < ORDER.length; i++) {
    const letter = ORDER[i];
    const spot = isOpen(board, letter);
    if (spot) {
      // check hallway and top
      if (letter === A) {
        let a;
        switch (spot) {
          case 4:
            a = '...A';
            break;
          case 3:
            a = '..AA';
            break;
          case 2:
            a = '.AAA';
            break;
          case 1:
            a = 'AAAA';
            break;
        }

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
        if (hallway[3] === '.' && board.B[0] === A) {
          const newB = '.' + board.B[1];
          paths.push({
            newBoard: { ...board, B: newB, A: a },
            newScore: score + 3 + spot,
          });
        }
        if (hallway[3] === '.' && board.B === '.A') {
          const newB = '..';
          paths.push({
            newBoard: { ...board, B: newB, A: a },
            newScore: score + 4 + spot,
          });
        }
        if (hallway[3] === '.' && hallway[5] === '.' && hallway[7] === A) {
          const newHallway = change(hallway, 7, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, A: a },
            newScore: score + 5 + spot,
          });
        }
        if (hallway[3] === '.' && hallway[5] === '.' && board.C[0] === A) {
          const newC = '.' + board.C[1];
          paths.push({
            newBoard: { ...board, C: newC, A: a },
            newScore: score + 5 + spot,
          });
        }
        if (hallway[3] === '.' && hallway[5] === '.' && board.C === '.A') {
          const newC = '..';
          paths.push({
            newBoard: { ...board, C: newC, A: a },
            newScore: score + 6 + spot,
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
          board.D[0] === A
        ) {
          const newD = '.' + board.D[1];
          paths.push({
            newBoard: { ...board, D: newD, A: a },
            newScore: score + 7 + spot,
          });
        }
        if (
          hallway[3] === '.' &&
          hallway[5] === '.' &&
          hallway[7] === '.' &&
          board.D === '.A'
        ) {
          const newD = '..';
          paths.push({
            newBoard: { ...board, D: newD, A: a },
            newScore: score + 8 + spot,
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
        let b;
        switch (spot) {
          case 4:
            b = '...B';
            break;
          case 3:
            b = '..BB';
            break;
          case 2:
            b = '.BBB';
            break;
          case 1:
            b = 'BBBB';
            break;
        }

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
        if (hallway[3] === '.' && board.A[0] === B) {
          const newA = '.' + board.A[1];
          paths.push({
            newBoard: { ...board, A: newA, B: b },
            newScore: score + costB * (3 + spot),
          });
        }
        if (hallway[3] === '.' && board.A === '.B') {
          const newA = '..';
          paths.push({
            newBoard: { ...board, A: newA, B: b },
            newScore: score + costB * (4 + spot),
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
        if (hallway[5] === '.' && board.C[0] === B) {
          const newC = '.' + board.C[1];
          paths.push({
            newBoard: { ...board, C: newC, B: b },
            newScore: score + costB * (3 + spot),
          });
        }
        if (hallway[5] === '.' && board.C === '.B') {
          const newC = '..';
          paths.push({
            newBoard: { ...board, C: newC, B: b },
            newScore: score + costB * (4 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[7] === '.' && hallway[9] === B) {
          const newHallway = change(hallway, 9, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, B: b },
            newScore: score + costB * (5 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[7] === '.' && board.D[0] === B) {
          const newD = '.' + board.D[1];
          paths.push({
            newBoard: { ...board, D: newD, B: b },
            newScore: score + costB * (5 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[7] === '.' && board.D === '.B') {
          const newD = '..';
          paths.push({
            newBoard: { ...board, D: newD, B: b },
            newScore: score + costB * (6 + spot),
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
        let c;
        switch (spot) {
          case 4:
            c = '...C';
            break;
          case 3:
            c = '..CC';
            break;
          case 2:
            c = '.CCC';
            break;
          case 1:
            c = 'CCCC';
            break;
        }

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
        if (hallway[7] === '.' && board.D[0] === 'C') {
          const newD = '.' + board.D[1];
          paths.push({
            newBoard: { ...board, D: newD, C: c },
            newScore: score + costC * (3 + spot),
          });
        }
        if (hallway[7] === '.' && board.D === '.C') {
          const newD = '..';
          paths.push({
            newBoard: { ...board, D: newD, C: c },
            newScore: score + costC * (4 + spot),
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
        if (hallway[5] === '.' && board.B[0] === 'C') {
          const newB = '.' + board.B[1];
          paths.push({
            newBoard: { ...board, B: newB, C: c },
            newScore: score + costC * (3 + spot),
          });
        }
        if (hallway[5] === '.' && board.B === '.C') {
          const newB = '..';
          paths.push({
            newBoard: { ...board, B: newB, C: c },
            newScore: score + costC * (4 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[3] === '.' && hallway[1] === C) {
          const newHallway = change(hallway, 1, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, C: c },
            newScore: score + costC * (5 + spot),
          });
        }

        if (hallway[5] === '.' && hallway[3] === '.' && board.A[0] === 'C') {
          const newA = '.' + board.A[1];
          paths.push({
            newBoard: { ...board, A: newA, C: c },
            newScore: score + costC * (5 + spot),
          });
        }
        if (hallway[5] === '.' && hallway[3] === '.' && board.A === '.C') {
          const newA = '..';
          paths.push({
            newBoard: { ...board, A: newA, C: c },
            newScore: score + costC * (6 + spot),
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
        let d;
        switch (spot) {
          case 4:
            d = '...D';
            break;
          case 3:
            d = '..DD';
            break;
          case 2:
            d = '.DDD';
            break;
          case 1:
            d = 'DDDD';
            break;
        }

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
        if (hallway[7] === '.' && board.C[0] === D) {
          const newC = '.' + board.C[1];
          paths.push({
            newBoard: { ...board, C: newC, D: d },
            newScore: score + costD * (3 + spot),
          });
        }
        if (hallway[7] === '.' && board.C === '.D') {
          const newC = '..';
          paths.push({
            newBoard: { ...board, C: newC, D: d },
            newScore: score + costD * (4 + spot),
          });
        }
        if (hallway[7] === '.' && hallway[5] === '.' && hallway[3] === D) {
          const newHallway = change(hallway, 3, '.');
          paths.push({
            newBoard: { ...board, hallway: newHallway, D: d },
            newScore: score + costD * (5 + spot),
          });
        }
        if (hallway[7] === '.' && hallway[5] === '.' && board.B[0] === D) {
          const newB = '.' + board.B[1];
          paths.push({
            newBoard: { ...board, B: newB, D: d },
            newScore: score + costD * (5 + spot),
          });
        }
        if (hallway[7] === '.' && hallway[5] === '.' && board.B === '.D') {
          const newB = '..';
          paths.push({
            newBoard: { ...board, B: newB, D: d },
            newScore: score + costD * (6 + spot),
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
          hallway[7] === '.' &&
          hallway[5] === '.' &&
          hallway[3] === '.' &&
          board.A[0] === D
        ) {
          const newA = '.' + board.A[1];
          paths.push({
            newBoard: { ...board, A: newA, D: d },
            newScore: score + costD * (7 + spot),
          });
        }
        if (
          hallway[7] === '.' &&
          hallway[5] === '.' &&
          hallway[3] === '.' &&
          board.A === '.D'
        ) {
          const newA = '..';
          paths.push({
            newBoard: { ...board, A: newA, D: d },
            newScore: score + costD * (8 + spot),
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

function findMovePaths(board, score) {
  const { hallway } = board;
  const paths = [];

  for (let h = 0; h < ORDER.length; h++) {
    const letter = ORDER[h];
    const home = board[letter];

    // top to bottom
    const [q, w, e, r] = home;
    let spot;
    let mov;

    if (q === '.' && w === '.' && e === '.' && r !== '.' && r !== letter) {
      spot = 3;
      mov = r;
    } else if (
      q === '.' &&
      w === '.' &&
      e !== '.' &&
      (e !== letter || r !== letter)
    ) {
      spot = 2;
      mov = e;
    } else if (
      q === '.' &&
      w !== '.' &&
      (w !== letter || e !== letter || r !== letter)
    ) {
      spot = 1;
      mov = w;
    } else if (
      q !== '.' &&
      (q !== letter || w !== letter || e !== letter || r !== letter)
    ) {
      spot = 0;
      mov = q;
    }

    if (letter === A) {
      if (hallway[1] === '.') {
        const newHallway = change(hallway, 1, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[1] === '.' && hallway[0] === '.') {
        const newHallway = change(hallway, 0, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 3),
        });
      }
      if (hallway[3] === '.') {
        const newHallway = change(hallway, 3, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[3] === '.' && hallway[5] === '.') {
        const newHallway = change(hallway, 5, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 4),
        });
      }
      if (hallway[3] === '.' && hallway[5] === '.' && hallway[7] === '.') {
        const newHallway = change(hallway, 7, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 6),
        });
      }
      if (
        hallway[3] === '.' &&
        hallway[5] === '.' &&
        hallway[7] === '.' &&
        hallway[9] === '.'
      ) {
        const newHallway = change(hallway, 9, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 8),
        });
      }
      if (
        hallway[3] === '.' &&
        hallway[5] === '.' &&
        hallway[7] === '.' &&
        hallway[9] === '.' &&
        hallway[10] === '.'
      ) {
        const newHallway = change(hallway, 10, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, A: newHome },
          newScore: score + cost(mov) * (spot + 9),
        });
      }
    } else if (letter == B) {
      if (hallway[3] === '.') {
        const newHallway = change(hallway, 3, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[5] === '.') {
        const newHallway = change(hallway, 5, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[3] === '.' && hallway[1] === '.') {
        const newHallway = change(hallway, 1, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 4),
        });
      }
      if (hallway[3] === '.' && hallway[1] === '.' && hallway[0] === '.') {
        const newHallway = change(hallway, 0, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 5),
        });
      }
      if (hallway[5] === '.' && hallway[7] === '.') {
        const newHallway = change(hallway, 7, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 4),
        });
      }
      if (hallway[5] === '.' && hallway[7] === '.' && hallway[9] === '.') {
        const newHallway = change(hallway, 9, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 6),
        });
      }
      if (
        hallway[5] === '.' &&
        hallway[7] === '.' &&
        hallway[9] === '.' &&
        hallway[10] === '.'
      ) {
        const newHallway = change(hallway, 9, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, B: newHome },
          newScore: score + cost(mov) * (spot + 7),
        });
      }
    } else if (letter == C) {
      if (hallway[7] === '.') {
        const newHallway = change(hallway, 7, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[5] === '.') {
        const newHallway = change(hallway, 5, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[7] === '.' && hallway[9] === '.') {
        const newHallway = change(hallway, 9, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 4),
        });
      }
      if (hallway[7] === '.' && hallway[9] === '.' && hallway[10] === '.') {
        const newHallway = change(hallway, 10, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 5),
        });
      }
      if (hallway[5] === '.' && hallway[3] === '.') {
        const newHallway = change(hallway, 3, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 4),
        });
      }
      if (hallway[5] === '.' && hallway[3] === '.' && hallway[1] === '.') {
        const newHallway = change(hallway, 1, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 6),
        });
      }
      if (
        hallway[5] === '.' &&
        hallway[3] === '.' &&
        hallway[1] === '.' &&
        hallway[0] === '.'
      ) {
        const newHallway = change(hallway, 0, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, C: newHome },
          newScore: score + cost(mov) * (spot + 7),
        });
      }
    } else if (letter == D) {
      if (hallway[9] === '.') {
        const newHallway = change(hallway, 9, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[9] === '.' && hallway[10] === '.') {
        const newHallway = change(hallway, 10, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 3),
        });
      }
      if (hallway[7] === '.') {
        const newHallway = change(hallway, 7, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 2),
        });
      }
      if (hallway[7] === '.' && hallway[5] === '.') {
        const newHallway = change(hallway, 5, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 4),
        });
      }
      if (hallway[3] === '.' && hallway[5] === '.' && hallway[7] === '.') {
        const newHallway = change(hallway, 3, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 6),
        });
      }
      if (
        hallway[3] === '.' &&
        hallway[5] === '.' &&
        hallway[7] === '.' &&
        hallway[1] === '.'
      ) {
        const newHallway = change(hallway, 1, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 8),
        });
      }
      if (
        hallway[3] === '.' &&
        hallway[5] === '.' &&
        hallway[7] === '.' &&
        hallway[1] === '.' &&
        hallway[0] === '.'
      ) {
        const newHallway = change(hallway, 0, mov);
        const newHome = change(home, spot, '.');

        paths.push({
          newBoard: { ...board, hallway: newHallway, D: newHome },
          newScore: score + cost(mov) * (spot + 9),
        });
      }
    }
  }

  return paths;
}

function isOpen(board, letter) {
  if (board[letter] === '....') {
    return 4;
  }
  if (board[letter] === `...${letter}`) {
    return 3;
  }
  if (board[letter] === `..${letter}${letter}`) {
    return 2;
  }
  if (board[letter] === `.${letter}${letter}${letter}`) {
    return 1;
  }
  return 0;
}

function isDone(board) {
  if (board.hallway !== HALLWAY) {
    return false;
  }
  if (board.A != 'AAAA') {
    return false;
  }
  if (board.B != 'BBBB') {
    return false;
  }
  if (board.C != 'CCCC') {
    return false;
  }
  if (board.D != 'DDDD') {
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
