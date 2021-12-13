import { readFile } from 'fs/promises';

const GRAPH = {};
const START = 'start';
const END = 'end';
const fullPaths = [];

// 11ab
async function init() {
  const input = await readFile('twelve.txt', 'utf8');

  const connections = input.split('\n');
  connections.forEach((c) => {
    const [from, to] = c.split('-');
    add(from, to);
    add(to, from);
  });

  console.log(GRAPH);

  for (let next of GRAPH[START]) {
    const currentPath = [START, next];
    findPath(currentPath, next);
  }
  console.log(fullPaths.length);
}

function findPath(currentPath, last) {
  for (let next of GRAPH[last]) {
    if (next === END) {
      fullPaths.push([...currentPath, END].join(','));
    } else if (next === START) {
    } else if (next.toUpperCase() !== next && moreThanOne(currentPath, next)) {
    } else if (validPath([...currentPath, next])) {
      findPath([...currentPath, next], next);
    }
  }
}

function moreThanOne(path, node) {
  return path.filter((n) => n === node).length >= 2;
}

function validPath(path) {
  let num = 0;
  let smalls = {};
  for (let i = 0; i < path.length; i++) {
    const cur = path[i];
    if (cur.toUpperCase() !== cur) {
      if (smalls[cur]) {
        num++;
      } else {
        smalls[cur] = true;
      }
    }
    if (num >= 2) {
      return false;
    }
  }
  return true;
}

function add(from, to) {
  if (GRAPH[from]) {
    GRAPH[from].add(to);
  } else {
    GRAPH[from] = new Set();
    GRAPH[from].add(to);
  }
}

init();
