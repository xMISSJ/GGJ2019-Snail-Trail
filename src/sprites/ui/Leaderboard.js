import Phaser from 'phaser';
import LeaderboardCard from './LeaderboardCard';
import GameManager from '../../services/gameManager';
import SignalManager from '../../services/signalManager';

export default class Leaderboard extends Phaser.Group {
  constructor() {
    super(game);
    this.cards = [];
    this.queue = [];
    this.tweenSpeed = 800;
    this.createLeaderboard();
    SignalManager.instance.add('switchLeaderboard', (id1, id2) => {
      this.addToQueue(id1, id2);
    });
    SignalManager.instance.add('gameReset', () => {
      this.resetLeaderboard();
    });
  }

  createLeaderboard() {
    for (let i = 0; i < 4; i += 1) {
      this.cards[i] = new LeaderboardCard(i + 1, 350 + (i * 250), 20);
    }
  }

  addToQueue(id1, id2) {
    // console.log(id1, id2);
    // const tempPos = this.cards[id1 - 1].x;
    // this.cards[id1 - 1].x = this.cards[id2 - 1].x;
    // this.cards[id2 - 1].x = tempPos;

    this.queue.push([id1 - 1, id2 - 1]);
    if (this.queue.length === 1) {
      this.tweenCards(id1 - 1, id2 - 1);
    }
  }

  tweenCards(id1, id2) {
    const pos1 = this.cards[id1].x;
    const pos2 = this.cards[id2].x;

    game.add.tween(this.cards[id1]).to({ x: pos2 }, this.tweenSpeed, Phaser.Easing.Sinusoidal.InOut, true);
    game.add.tween(this.cards[id2]).to({ x: pos1 }, this.tweenSpeed, Phaser.Easing.Sinusoidal.InOut, true)
      .onComplete.add(() => {
        this.tweening = false;
        this.queue.shift();
        if (this.queue.length > 0) {
          this.tweenCards(this.queue[0][0], this.queue[0][1]);
        }
    });
  }

  update() {
    for (let i = 0; i < 4; i += 1) {
      if (GameManager.instance.getPlayerScore(i + 1) === undefined) {
        return;
      }
      this.cards[i].setScore(GameManager.instance.getPlayerScore(i + 1).toFixed(2));
    }
  }

  resetLeaderboard() {
    for (let i = 0; i < 4; i += 1) {
      this.cards[i].x = 350 + (i * 250);
    }
  }
}