import { readFile } from 'fs/promises';

const SCANNERS = [];

// 19a
async function init() {
  // console.time('0');
  const input = await readFile('nineteen.test.txt', 'utf8');

  let scanner = 0;
  SCANNERS[scanner] = { probes: [] };

  input.split('\n').forEach((line) => {
    if (line === '') {
      scanner++;
      SCANNERS[scanner] = { probes: [] };

      return;
    }
    if (line[1] === '-') {
      return;
    }

    const [x, y, z] = line.split(',').map((d) => parseInt(d));
    SCANNERS[scanner].probes.push({ x, y, z });
  });

  SCANNERS.forEach((scanner) => {
    scanner.pairs = [];
    const { probes } = scanner;

    for (let i = 0; i < probes.length; i++) {
      scanner.pairs[i] = [];
      for (let j = i + 1; j < probes.length; j++) {
        scanner.pairs[i][j] = distance(probes[i], probes[j]);
      }
    }
  });

  // try scanner 0 with scanner 1
  const scanA = SCANNERS[0];
  const scanB = SCANNERS[1];

  let matches = [];
  let a = new Set();
  let b = new Set();

  scanA.probes.forEach((aa, ai) => {
    for (let aj = ai + 1; aj < scanA.probes.length; aj++) {
      scanB.probes.forEach((bb, bi) => {
        for (let bj = bi + 1; bj < scanB.probes.length; bj++) {
          if (absDistanceMatches(scanA.pairs[ai][aj], scanB.pairs[bi][bj])) {
            a.add(ai);
            a.add(aj);
            b.add(bi);
            b.add(bj);
            matches.push({ ai, aj, bi, bj });
          }
        }
      });
    }
  });

  console.log(a, b);
  console.log(matches.length);
}

function absDistanceMatches(pairA, pairB) {
  if (pairA.abs === pairB.abs) {
    return true;
  }
  return false;
}
function relativeDistanceMatches(pairA, pairB) {
  // keep pairA, rotate pairB through all 24 possible orientations
  let newB;
  for (let dir = 0; dir < 6; dir++) {
    for (let rot = 0; rot < 4; rot++) {
      // ???
    }
  }

  return false;
}

function distance(p1, p2) {
  const rel = {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
    z: p1.z - p2.z,
  };

  const abs = rel.x * rel.x + rel.y * rel.y + rel.z * rel.z;

  return { abs, rel };
}

init();
