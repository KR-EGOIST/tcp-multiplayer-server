import net from 'net';
import { getProtoMessages, loadProtos } from './src/init/loadProtos.js';

const TOTAL_LENGTH = 4;
const PACKET_TYPE_LENGTH = 1;

const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0),
    packetType: buffer.readInt8(TOTAL_LENGTH),
  };
};

const sendPacket = (socket, packet) => {
  const protoMessages = getProtoMessages();
  const Packet = protoMessages.common.Packet;
  if (!Packet) {
    console.error('Packet 메시지를 찾을 수 없습니다.');
    return;
  }

  const buffer = Packet.encode(packet).finish();

  const packetLength = Buffer.alloc(TOTAL_LENGTH);
  packetLength.writeUInt32BE(buffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

  const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
  packetType.writeInt8(1, 0);

  const packetWithLength = Buffer.concat([packetLength, packetType, buffer]);

  socket.write(packetWithLength);
};

const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();

client.connect(PORT, HOST, async () => {
  console.log('서버와 연결되었습니다.');
  await loadProtos();

  const message = {
    handlerId: 2,
    userId: 'xyz',
    clientVersion: '1.0.0',
    sequence: 0,
    payload: {},
  };

  sendPacket(client, message);
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
