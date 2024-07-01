import { config } from '../config/config.js';

export const onData = (socket) => (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  while (socket.buffer.length >= totalHeaderLength) {
    // readUInt32BE 4 바이트 만큼 읽는다. 4바이트를 반환하는게 아니라.
    const length = socket.buffer.readUInt32BE(0);
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    if (socket.buffer.length >= length) {
      const packet = socket.buffer.slice(totalHeaderLength, length);
      // slice(시작 위치 , [갯수]);
      socket.buffer = socket.buffer.slice(length);

      console.log(`length: ${length}`);
      console.log(`packetType: ${packetType}`);
      console.log(packet);
    } else {
      break;
    }
  }
};
