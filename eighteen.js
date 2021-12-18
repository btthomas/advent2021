import { readFile } from 'fs/promises';

// 18a
async function init() {
  // console.time('0');
  const input = await readFile('eighteen.txt', 'utf8');
  const lines = input.split('\n').map((line) => JSON.parse(line));

  let biggest = 0;

  const final = lines.reduce((acc, line) => {
    let current;

    if (acc) {
      current = [acc, line];
      // console.log(JSON.stringify(current));
    } else {
      return line;
    }

    while (true) {
      let path = findExplode(current);
      if (path) {
        explode(current, path);
        // console.log(JSON.stringify(current));
      } else {
        path = findSplit(current);
        if (path) {
          split(current, path);
          // console.log(JSON.stringify(current));
        } else {
          // done
          // console.log(JSON.stringify(current));
          break;
        }
      }
    }

    return current;
  }, false);

  console.log(JSON.stringify(final));
  console.log(magnitude(final));
}

function magnitude(line) {
  if (typeof line === 'object') {
    return 3 * magnitude(line[0]) + 2 * magnitude(line[1]);
  } else {
    return line;
  }
}

function findExplode(line) {
  const path = [0];
  while (path[0] === 0 || path[0] === 1) {
    const current = path.reduce((acc, i) => acc[i], line);

    if (typeof current === 'object' && path.length > 3) {
      return path;
    }

    if (typeof current === 'object') {
      path.push(0);
    } else {
      // :)
      path[path.length - 1]++;

      if (path[path.length - 1] === 2) {
        path.pop();
        path[path.length - 1]++;

        if (path[path.length - 1] === 2) {
          path.pop();
          path[path.length - 1]++;

          if (path[path.length - 1] === 2) {
            path.pop();
            path[path.length - 1]++;
          }
        }
      }
    }
  }
  return false;
}

function explode(line, path) {
  const i = path.pop();
  let current = path.reduce((acc, i) => acc[i], line);

  // console.log({
  //   line: JSON.stringify(line),
  //   path: [...path, i],
  //   cur0: current[i][0],
  //   cur1: current[i][1],
  // });

  addLeft(line, [...path, i], current[i][0]);
  addRight(line, [...path, i], current[i][1]);
  current[i] = 0;
}

function addLeft(line, path, num) {
  if (path[path.length - 1] === 1) {
    path[path.length - 1] = 0;
  } else {
    // need to go up until you find a 1
    while (path.length) {
      path.pop();
      if (path[path.length - 1] === 1) {
        path[path.length - 1] = 0;
        break;
      }
    }
  }
  if (path.length) {
    // go down and right
    while (true) {
      const current = path.reduce((acc, i) => acc[i], line);
      if (typeof current === 'object') {
        path.push(1);
      } else {
        // found it!
        const i = path.pop();
        const parent = path.reduce((acc, i) => acc[i], line);
        parent[i] += num;
        break;
      }
    }
  } else {
    // console.log('none');
  }
}

function addRight(line, path, num) {
  if (path[path.length - 1] === 0) {
    path[path.length - 1] = 1;
  } else {
    // need to go up until you find a 0
    while (path.length) {
      path.pop();
      if (path[path.length - 1] === 0) {
        path[path.length - 1] = 1;
        break;
      }
    }
  }

  if (path.length) {
    // go down and left
    while (true) {
      const current = path.reduce((acc, i) => acc[i], line);
      if (typeof current === 'object') {
        path.push(0);
      } else {
        // found it!
        const i = path.pop();
        const parent = path.reduce((acc, i) => acc[i], line);

        parent[i] += num;
        break;
      }
    }
  } else {
    // console.log('none');
  }
}

function findSplit(line) {
  const path = [0];
  while (path[0] === 0 || path[0] === 1) {
    const current = path.reduce((acc, i) => acc[i], line);

    if (current !== 'object' && current >= 10) {
      return path;
    }

    if (typeof current === 'object') {
      path.push(0);
    } else if (current >= 10) {
      return path;
    } else {
      // :)
      path[path.length - 1]++;

      if (path[path.length - 1] === 2) {
        path.pop();
        path[path.length - 1]++;

        if (path[path.length - 1] === 2) {
          path.pop();
          path[path.length - 1]++;

          if (path[path.length - 1] === 2) {
            path.pop();
            path[path.length - 1]++;
          }
        }
      }
    }
  }
  return false;
}

function split(line, path) {
  const i = path.pop();
  const current = path.reduce((acc, i) => acc[i], line);
  const num = current[i];
  const left = Math.floor(num / 2);
  const right = num - left;
  current[i] = [left, right];
}

init();
