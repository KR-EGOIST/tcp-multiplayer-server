import { loadProtos } from './loadProtos.js';
import { testAllConnection } from '../utils/db/testConnection.js';
import pools from '../db/database.js';

const initServer = async () => {
  try {
    await loadProtos();
    await testAllConnection(pools); // DB 연결 테스트
  } catch (err) {
    console.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
