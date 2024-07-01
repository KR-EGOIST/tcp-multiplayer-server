import net from 'net';

const TOTAL_LENGTH = 4;
const PACKET_TYPE_LENGTH = 1;

const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0),
    packetType: buffer.readInt8(TOTAL_LENGTH),
  };
};

const writeHeader = (length, packetType) => {
  const headerSize = TOTAL_LENGTH + PACKET_TYPE_LENGTH;
  const buffer = Buffer.alloc(headerSize);
  buffer.writeUInt32BE(length + headerSize, 0);
  buffer.writeInt8(packetType, TOTAL_LENGTH);
  return buffer;
};

const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('서버와 연결되었습니다.');

  const message = 'Hi, There!';
  const test = Buffer.from(message);

  const header = writeHeader(test.length, 11);
  const packet = Buffer.concat([header, test]);
  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data);

  const { packetType, length } = readHeader(buffer);
  console.log(`패킷 타입: ${packetType}`);
  console.log(`길이: ${length}`);

  const headerSize = TOTAL_LENGTH + PACKET_TYPE_LENGTH;
  const message = buffer.slice(headerSize);

  console.log(`서버에게 받은 메시지: ${message}`);
});

client.on('close', () => {
  console.log('서버와의 연결이 종료되었습니다.');
});

client.on('error', (err) => {
  console.log('클라이언트 에러: ', err);
});

process.on('SIGINT', () => client.end(() => process.exit(0)));
