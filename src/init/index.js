import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadProtos();
  } catch (err) {
    console.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
