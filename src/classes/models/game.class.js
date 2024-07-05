import { createLocationPacket } from '../../utils/notification/game.notification.js';

class Game {
  constructor(id) {
    this.id = id; // 유저 id
    this.users = []; // 모든 유저의 정보를 가지는 users
    this.state = 'waiting'; // 'waiting(대기중)', 'inProgress(진행중)'
  }

  addUser(user) {
    this.users.push(user);
  }

  // user 가 없으면 undefined 가 반환됨
  // user 가 있을 때만 확인을 해라
  getUser(userId) {
    return this.users.find((user) => user.deviceId === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  // getMaxLatency() {
  //   let maxLatency = 0;
  //   this.users.forEach((user) => {
  //     maxLatency = Math.max(maxLatency, user.latency);
  //   });
  //   return maxLatency;
  // }

  // user 클래스의 각각의 유저 x, y 위치 정보를 하나의 배열로 합치고 패킷으로 변환한다.
  getAllLocation(userId) {
    // const maxLatency = this.getMaxLatency(); // 전체 유저의 최대 레이턴시 구하기

    const locationData = this.users
      .filter((user) => user.deviceId !== userId)
      .map((user) => {
        const { x, y } = user.calculatePosition();
        // const { x, y } = user.getPosition();
        return { id: user.deviceId, playerId: user.playerId, x, y };
      });
    return createLocationPacket(locationData);
  }
}

export default Game;
