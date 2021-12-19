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

// 16a
async function init() {
  const input = await readFile('sixteen.test.txt', 'utf8');

  const bin = [...input].map((char) => HEX[char]).join('');

  const [result, length] = parseBin({ bin });
  console.log(result, length);
}

function parseBin({ bin, bitLimit, packetLimit }) {
  const version = parseInt(bin.substring(0, 3), 2);
  const type = parseInt(bin.substring(3, 6), 2);
  let payload;
  if (bitLimit || bitLimit === 0) {
    payload = bin.substring(6, bitLimit);
  } else {
    payload = bin.substring(6);
  }

  console.log({ version, type, payload, bitLimit, packetLimit });
  let value;
  let length;
  let rest;

  if (type === 4) {
    // literal
    ({ value, length, rest } = parseLiteral(payload));

    if (bitLimit > 0) {
      const [v, l] = parseBin({ bin: rest, bitLimit: bitLimit - length });
      return [version + v, length + l];
    } else if (bitLimit <= 0) {
      return [version, length];
    } else if (packetLimit > 1) {
      const [v, l] = parseBin({ bin: rest, packetLimit: packetLimit - 1 });
      return [version + v, length + l];
    } else if (packetLimit <= 1) {
      return [version, length];
    } else if (rest.length) {
      const [v, l] = parseBin({ bin: rest });
      return [version + v, length + l];
    } else {
      return [version, length];
    }
  } else {
    // operator
    const lenId = payload.substring(0, 1);
    const packetData = payload.substring(1);
    if (lenId === '0') {
      // 15 bits
      const totalLength = parseInt(packetData.substring(0, 15), 2);
      const data = packetData.substring(15, 15 + totalLength);
      const rest = packetData.substring(15 + totalLength);

      if (bitLimit > 0) {
        const [v1, l1] = parseBin({ bin: data });
        const [v2, l2] = parseBin({
          bin: rest,
          bitLimit: bitLimit - (15 + totalLength + l1),
        });
        return [version + v1 + v2, length + l1 + l2];
      } else if (bitLimit <= 0) {
        const [v, l] = parseBin({ bin: data });
        return [version + v, length + l];
      } else if (packetLimit > 1) {
        const [v1, l1] = parseBin({ bin: data });
        const [v2, l2] = parseBin({ bin: rest, packetLimit: packetLimit - 1 });
        return [version + v1 + v2, length + l1 + l2];
      } else if (packetLimit <= 1) {
        const [v, l] = parseBin({ bin: data });
        return [version + v, length + l];
      } else if (rest.length) {
        const [v1, l1] = parseBin({ bin: data });
        const [v2, l2] = parseBin({ bin: rest });
        return [version + v1 + v2, length + l1 + l2];
      } else {
        const [v, l] = parseBin({ bin: data });
        return [version + v, length + l];
      }
    } else {
      // 11 bits
      const numPackets = parseInt(packetData.substring(0, 11), 2);
      const data = packetData.substring(11);

      if (bitLimit > 0) {
        const [v, l] = parseBin({ bin: data, packetLimit: numPackets });
        return [version + v, l];
      } else if (bitLimit <= 0) {
        const [v, l] = parseBin({ bin: data, packetLimit: numPackets });
        return [version + v, l];
      } else if (packetLimit > 1) {
        const [v1, l1] = parseBin({ bin: data, packetLimit: numPackets });
        const [v2, l2] = parseBin({
          bin: rest,
          packetLimit: packetLimit - 1,
        });

        return [version + v1 + v2, length + l1 + l2];
      } else if (packetLimit <= 1) {
        const [v, l] = parseBin({ bin: data, packetLimit: numPackets });
        return [version + v, l];
      } else {
        const [v, l] = parseBin({ bin: data, packetLimit: numPackets });
        return [version + v, l];
      }
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
  const value = parseInt(num.join(''), 2);

  // console.log({ value });

  return {
    value,
    length: index,
    rest,
  };
}

init();
