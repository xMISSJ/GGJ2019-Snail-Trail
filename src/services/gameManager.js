import Phaser from 'phaser';
import Singleton from './singleton';
import CountDownText from "../sprites/countDownText";
import SignalManager from '../services/signalManager';
import Text from "./text";
import BackgroundMusic from '../services/backgroundMusic';

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

    this.key3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    this.key3.onDown.add(this.togglePause, this);

    this.paused = false;
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
    SignalManager.instance.dispatch('switchShell', this.shellHolder);
    game.shellShine.onShellPickUp();
  }

  dropShell() {
    this.shellHolder = 0;
    SignalManager.instance.dispatch('switchShell', this.shellHolder);
  }

  checkPlayerWin(playerID) {
    if (this.playerScores[playerID - 1] >= this.winAmount) {
      console.log('Player ' + playerID + ' wins');
      this.endGame(playerID);
    }
  }

  endGame(playerID) {
    SignalManager.instance.dispatch('gameEnd');
    this.currentState = this.states.end;

    this.winText = new Text({
      text: 'Player ' + playerID + ' wins!!!!',
      anchor: new Phaser.Point(0.5, 0.5),
      position: new Phaser.Point(game.width / 2, game.height / 2),
      color: '#FFFFFF',
      fontSize: 50,
      stroke: '#000000',
      strokeThickness: 10,
    });
    game.add.existing(this.winText);
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
      position: new Phaser.Point(game.width / 2, game.height / 2),
      anchor: new Phaser.Point(0.5, 0.5),
      color: '#FFFFFF',
      fontSize: 80,
      stroke: '#000000',
      strokeThickness: 10,
    });
    this.objectiveText = new Text({
      text: 'Hold the shell for 30 seconds!',
      position: new Phaser.Point(game.width / 2, game.height / 2 + 100),
      anchor: new Phaser.Point(0.5, 0.5),
      color: '#FFFFFF',
      fontSize: 30,
      stroke: '#000000',
      strokeThickness: 10,
    });
    game.add.existing(this.objectiveText);
    game.add.existing(this.countDown);
    game.add.tween(this.countDown.scale).to({ x: 2, y: 2 }, 500, Phaser.Easing.Sinusoidal.InOut, true).yoyo(true).loop(true);
    this.countDown.start(() => {
      this.currentState = this.states.game;
      this.countDown.destroy();
      this.objectiveText.destroy();
      BackgroundMusic.instance.playInGameSound();
    }, this);
  }

  update() {
    if (this.currentState === this.states.game) {
      this.addTimeToPlayerScore(this.shellHolder);
    }
  }

  togglePause() {
    this.paused = !this.paused;

    switch(this.paused) {
      case false:
        this.timer.resume()
        break;
      case true:
        this.timer.pause()
        break;
    }
  }
}
