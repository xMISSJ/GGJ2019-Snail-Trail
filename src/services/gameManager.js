import phaser from 'phaser';
import Singleton from './singleton';

export default class GameManager extends Singleton {
  constructor() {
    super();
    this.playerScores = [];
    this.shellHolder = 0;
    this.winAmount = 5;
    this.timer = game.time.create(false);
  }

  startGame() {
    this.reset();
  }

  addTimeToPlayerScore(playerID) {
    this.playerScores[playerID - 1] = this.shellHolderStartScore + this.timer.seconds;
    console.log(this.playerScores);
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
      this.reset();
    }
  }

  reset() {
    this.timer.stop();
    this.shellHolder = 0;
    for (let i = 0; i < 4; i += 1) {
      this.playerScores[i] = 0;
    }
  }

  update() {
    if (this.shellHolder === 0) {
      return;
    }
    this.addTimeToPlayerScore(this.shellHolder);
  }
}
