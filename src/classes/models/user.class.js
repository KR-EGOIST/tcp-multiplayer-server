import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, deviceId, playerId, latency, x, y) {
    this.id = id;
    this.socket = socket;
    this.deviceId = deviceId;
    this.playerId = playerId;
    this.latency = latency;
    this.x = x;
    this.y = y;
    this.directionX = 0;
    this.directionY = 0;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    this.directionX = x;
    this.directionY = y;
    this.lastUpdateTime = Date.now();
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  ping() {
    const now = Date.now();
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  // 본인의 x, y위치는 각 user 클래스마다 가지고 있으므로 각자 계산한 뒤 나중에 모아서 보내면 된다.
  calculatePosition() {
    const timeDiff = this.latency / 1000; // 레이턴시(ms)를 초(s) 단위로 계산
    const speed = 3; // 클라이언트의 속도가 3으로 설정되어있음
    const frame = 1 / 60;
    // distance(거리) = speed(속도) * timeDiff(시간)
    const distance = speed * frame + speed * frame * timeDiff;

    this.x = this.x + distance * this.directionX;
    this.y = this.y + distance * this.directionY;

    return {
      x: this.x,
      y: this.y,
    };
  }
}

export default User;
