import Phaser from 'phaser';
import Singleton from './singleton';
import CountDownText from "../sprites/countDownText";
import SignalManager from '../services/signalManager';

export default class GameManager extends Singleton {
  constructor() {
    super();
    this.playerScores = [];
    this.leaderboard = [];
    this.shellHolder = 0;
    this.winAmount = 30;
    this.countDownValue = 3;
    this.states = {
      countDown: 0,
      game: 1,
      end: 2,
      pause: 3,
    };
    this.timer = game.time.create(false);
    this.currentState = this.states.pause;
  }

  startGame() {
    this.reset();
    this.currentState = this.states.countDown;
    this.startCountDown();
  }

  addTimeToPlayerScore(playerID) {
    if (playerID <= 0) {
      return;
    }
    this.playerScores[playerID - 1] = this.shellHolderStartScore + this.timer.seconds;
    this.checkPlayerWin(playerID);
    this.sortLeaderboard(playerID);
  }

  getPlayerScore(playerID) {
    return this.playerScores[playerID - 1];
  }

  sortLeaderboard(playerID) {
    this.currentPlacement = this.leaderboard.findIndex((element) => element === playerID);
    if (this.currentPlacement === 0) {
      return;
    }
    while (this.playerScores[this.leaderboard[this.currentPlacement] - 1] >= this.playerScores[this.leaderboard[this.currentPlacement - 1] - 1]) {
      SignalManager.instance.dispatch('switchLeaderboard', this.leaderboard[this.currentPlacement - 1], this.leaderboard[this.currentPlacement])
      const tempID = this.leaderboard[this.currentPlacement - 1];
      this.leaderboard[this.currentPlacement - 1] = this.leaderboard[this.currentPlacement];
      this.leaderboard[this.currentPlacement] = tempID;
      this.currentPlacement -= 1;
      if (this.currentPlacement === 0) {
        break;
      }
    }
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
  }

  reset() {
    this.timer.stop();
    this.shellHolder = 0;
    for (let i = 0; i < 4; i += 1) {
      this.playerScores[i] = 0;
      this.leaderboard[i] = i + 1;
    }
    SignalManager.instance.dispatch('gameReset');
  }

  startCountDown() {
    this.countDown = new CountDownText({
      startValue: 3,
      position: new Phaser.Point(game.world.centerX, game.world.centerY),
      anchor: new Phaser.Point(0.5, 0.5),
      color: '#000000',
      fontSize: 80,
    });
    game.add.existing(this.countDown);
    this.countDown.start(() => {
      this.currentState = this.states.game;
      this.countDown.destroy(); 
    }, this);
  }

  update() {
    if (this.currentState === this.states.game) {
      this.addTimeToPlayerScore(this.shellHolder);
    }
  }
}
