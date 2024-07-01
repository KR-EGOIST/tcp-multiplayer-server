import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../session/user.session.js';

export const onData = (socket) => async (data) => {
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

      switch (packetType) {
        case PACKET_TYPE.PING:
          break;
        case PACKET_TYPE.NORMAL:
          const { handlerId, userId, sequence, payload } = packetParser(packet);

          const user = getUserById(userId);
          if (user && user.sequence !== sequence) {
            console.error('잘못된 호출 값입니다.');
          }

          const handler = getHandlerById(handlerId);
          await handler({ socket, userId, payload });
      }
    } else {
      break;
    }
  }
};
