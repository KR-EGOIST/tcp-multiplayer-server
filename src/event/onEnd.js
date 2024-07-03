import { removeUser } from '../session/user.session.js';
import { getGameSession } from '../session/game.session.js';
import { gameId } from '../init/index.js';
import { getUserBySocket } from '../session/user.session.js';
import { updateUserLocation } from '../db/user/user.db.js';

export const onEnd = (socket) => async () => {
  console.log('클라이언트 연결이 종료되었습니다.');

  const user = getUserBySocket(socket);
  await updateUserLocation(user.x, user.y, user.id);

  const gameSession = getGameSession(gameId);
  gameSession.removeUser(user.id);

  removeUser(socket);
};
