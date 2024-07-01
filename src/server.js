import net from 'net';
import initServer from './init/index.js';

const PORT = 3000;

const server = net.createServer((socket) => {
  console.log(`클라이언트와 연결되었습니다: ${socket.remoteAddress}:${socket.remotePort}`);

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
    server.listen(PORT, () => {
      console.log(`서버가 ${PORT} 포트로 연결되었습니다.`);
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
