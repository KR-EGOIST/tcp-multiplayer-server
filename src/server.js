import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data);
  });

  socket.on('end', () => {
    console.log('클라이언트와 연결이 끊겼습니다.');
  });

  socket.on('error', (error) => {
    console.error('소켓 에러:', error);
  });
});

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
