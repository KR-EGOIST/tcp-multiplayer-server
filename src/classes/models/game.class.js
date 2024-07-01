const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting';
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('게임 세션이 가득 찼어요.');
    }

    this.users.push(user);

    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  startGame() {
    this.state = 'inProgress';
  }
}

export default Game;
