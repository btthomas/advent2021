import { readFile } from 'fs/promises';

const HEX = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

let VVersion = 0;

// 16a
async function init() {
  const input = await readFile('sixteen.txt', 'utf8');

  const bin = [...input].map((char) => HEX[char]).join('');

  const { result } = parseBin(bin);
  console.log(VVersion);
  console.log(result);
}

function parseBin(bin) {
  const version = parseInt(bin.substring(0, 3), 2);
  VVersion += version;
  const type = parseInt(bin.substring(3, 6), 2);
  const payload = bin.substring(6);

  // console.log({ version, type, payload });

  if (type === 4) {
    // literal
    const { result, rest } = parseLiteral(payload);

    return { result, data: rest };
  } else {
    // operator
    const lenId = payload.substring(0, 1);
    const packetData = payload.substring(1);
    let results = [];
    let leftoverData;

    if (lenId === '0') {
      // 15 bits
      const totalLength = parseInt(packetData.substring(0, 15), 2);
      let data = packetData.substring(15, 15 + totalLength);
      let rest = packetData.substring(15 + totalLength);
      let result;

      while (data && data.length) {
        ({ result, data } = parseBin(data));
        results.push(result);
      }

      leftoverData = rest;
    } else {
      // 11 bits
      const numPackets = parseInt(packetData.substring(0, 11), 2);
      let data = packetData.substring(11);
      let result;

      for (let i = 0; i < numPackets; i++) {
        ({ result, data } = parseBin(data));
        results.push(result);
      }

      leftoverData = data;
    }

    switch (type) {
      case 0:
        return {
          result: results.reduce((acc, d) => acc + d, 0),
          data: leftoverData,
        };
      case 1:
        return {
          result: results.reduce((acc, d) => acc * d, 1),
          data: leftoverData,
        };
      case 2:
        return {
          result: Math.min(...results),
          data: leftoverData,
        };
      case 3:
        return {
          result: Math.max(...results),
          data: leftoverData,
        };
      case 5:
        return {
          result: results[0] > results[1] ? 1 : 0,
          data: leftoverData,
        };
      case 6:
        return {
          result: results[0] < results[1] ? 1 : 0,
          data: leftoverData,
        };
      case 7:
        return {
          result: results[0] === results[1] ? 1 : 0,
          data: leftoverData,
        };
      default:
        return {
          result: 0,
          data: '',
        };
    }
  }
}

function parseLiteral(payload) {
  let index = 0;
  let num = [];
  let done = false;

  while (index < payload.length) {
    const char = payload[index];

    if (index % 5 === 0) {
      if (done) {
        break;
      }
      if (char === '0') {
        done = true;
      }
    } else {
      num.push(char);
    }
    index++;
  }

  const rest = payload.substring(index);
  const result = parseInt(num.join(''), 2);

  // console.log({ result });

  return {
    result,
    length: index,
    rest,
  };
}

init();
