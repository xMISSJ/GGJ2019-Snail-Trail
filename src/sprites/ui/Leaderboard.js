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
    this.cardAssets = [
      'leaderboardCardGreen',
      'leaderboardCardMagenta',
      'leaderboardCardOrange',
      'leaderboardCardBlue',
    ];
    this.createLeaderboard();
    SignalManager.instance.add('switchLeaderboard', (id1, id2) => {
      this.addToQueue(id1, id2);
    });
    SignalManager.instance.add('gameReset', () => {
      this.resetLeaderboard();
    });
    SignalManager.instance.add('switchShell', (shellHolder) => {
      this.tweenShellHolderCard(shellHolder);
    });
  }

  createLeaderboard() {
    for (let i = 0; i < 4; i += 1) {
      this.cards[i] = new LeaderboardCard(i + 1, this.cardAssets[i], 350 + (i * 250), 0);
      if (i >= game.totalPlayers) {
        this.cards[i].visible = false;
      }
    }
  }

  tweenShellHolderCard(holder) {
    if (this.oldHolder) {
      this.cards[this.oldHolder - 1].bobTween.stop();
    }
    if (holder === 0) {
      return;
    }
    this.cards[holder - 1].bobTween.start();
    this.oldHolder = holder;
  }

  addToQueue(id1, id2) {
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
    const shellHolder = GameManager.instance.shellHolder;
    if (shellHolder === 0) {
      return;
    }
    this.cards[shellHolder - 1].setScore(GameManager.instance.getPlayerScore(shellHolder).toFixed(2));
  }

  resetLeaderboard() {
    for (let i = 0; i < 4; i += 1) {
      this.cards[i].x = 350 + (i * 250);
    }
  }
}
