import phaser from 'phaser';
import Singleton from './singleton';

export default class GameManager extends Singleton {
  constructor() {
    super();
    this.playerScores = [];
    this.shellHolder = 0;
    this.winAmount = 5;
    this.states = {
      countDown: 0,
      game: 1,
      end: 2,
      pause: 3,
    };
    this.currentState = this.states.pause;
  }

  startGame() {
    this.reset();
    this.currentState = this.states.game;
  }

  addTimeToPlayerScore(playerID) {
    if (playerID <= 0) {
      return;
    }
    this.playerScores[playerID - 1] = this.shellHolderStartScore + this.timer.seconds;
    this.checkPlayerWin(playerID);
  }

  getPlayerScore(playerID) {
    return this.playerScores[playerID - 1];
  }

  pickUpShell(playerID) {
    this.shellHolder = playerID;
    this.shellHolderStartScore = this.playerScores[playerID - 1];
    this.timer = game.time.create(false);
    this.timer.start();
  }

  dropShell() {
    this.shellHolder = 0;
  }

  checkPlayerWin(playerID) {
    if (this.playerScores[playerID - 1] >= this.winAmount) {
      console.log('Player ' + playerID + ' wins');
      this.endGame();
    }
  }

  endGame() {
    this.currentState = this.states.end;
    this.reset();
  }

  reset() {
    this.timer.stop();
    this.shellHolder = 0;
    for (let i = 0; i < 4; i += 1) {
      this.playerScores[i] = 0;
    }
  }

  update() {
    if (this.currentState === this.states.game) {
      console.log(this.playerScores);
      this.addTimeToPlayerScore(this.shellHolder);
    }
  }
}
