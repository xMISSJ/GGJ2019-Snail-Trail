import Phaser from 'phaser';
import Singleton from './singleton';
import CountDownText from "../sprites/countDownText";

export default class GameManager extends Singleton {
  constructor() {
    super();
    this.playerScores = [];
    this.shellHolder = 0;
    this.winAmount = 5;
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

  startCountDown() {
    this.countDown = new CountDownText({
      startValue: 3,
      position: new Phaser.Point(game.world.centerX, game.world.centerY),
      anchor: new Phaser.Point(0.5, 0.5),
      color: '#FFFFFF',
    });
    game.add.existing(this.countDown);
    this.countDown.start(() => {
      this.currentState = this.states.game;
      this.countDown.destroy(); 
    }, this);
  }

  update() {

    if (this.currentState === this.states.game) {
      console.log(this.playerScores);
      this.addTimeToPlayerScore(this.shellHolder);
    }
  }
}
