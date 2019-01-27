import Phaser from 'phaser';
import Sprite from '../../services/sprite';
import Text from '../../services/text';
import GameManager from '../../services/gameManager';
import CollisionManager from '../collisionManager';

export default class RankingOverlay extends Phaser.Group {
  constructor() {
    super(game);
    this.startY = game.height - 70;
    this.rankingStages = ['stage1', 'stage2', 'stage3'];
    this.spriteNames = ['slugG', 'slugM', 'slugO', 'slugB'];
    this.slugNames = ['Bill', 'Phteven', 'Carl', 'Frank'];
    this.rankingPositions = [game.width / 2, game.width / 2 - 210, game.width / 2 + 210, game.width / 2 + 420];
    this.rankingScores = [];
    // this.victoryPoses = [];
    for (let i = 0; i < game.totalPlayers; i += 1) {
      this.createStage(i, this.rankingPositions[i]);
    }
  }

  createStage(index, posX) {
    let rankingStage;
    if (index !== 3) {
      rankingStage = game.add.sprite(posX, 1400, `${this.rankingStages[index]}`);
      rankingStage.scale.setTo(2.8);
      rankingStage.anchor.setTo(0.5, 1);
      this.add(rankingStage);
      game.time.events.add((game.totalPlayers - index) * 100, this.animateStage, this, rankingStage);
    }

    CollisionManager.instance.reset();

    const ySnailOffset = index === 3 ? 0 : rankingStage.height;
    const slug = game.add.sprite(posX, this.startY - ySnailOffset + 30, `${this.spriteNames[GameManager.instance.leaderboard[index] - 1]}`);
    slug.anchor.setTo(0.5, 1);
    slug.scale.setTo(2, 2);

    slug.visible = false;


    const nameText = new Text({ text: this.slugNames[GameManager.instance.leaderboard[index] - 1], position: new Phaser.Point(posX, this.startY - ySnailOffset - 100), fontSize: 20, color: '#FFFFFF', strokeThickness: 10 });
    this.add(nameText);
    nameText.visible = false;
    const rankText = new Text({ text: `#${index + 1}`, position: new Phaser.Point(posX, this.startY - ySnailOffset - 150), fontSize: 20, color: '#FFFFFF', strokeThickness: 10 });
    this.add(rankText);
    rankText.visible = false;
    game.time.events.add((game.totalPlayers - index) * 1000, this.animateSlug, this, slug, nameText, rankText);
    this.add(slug);
  }

  animateSlug(slug, nameText, rankText) {
    slug.visible = true;
    slug.scale.setTo(10, 10);
    game.make.tween(slug.scale).to({ x: 2, y: 2 }, 300, Phaser.Easing.Linear.None, true);

    nameText.visible = true;
    nameText.scale.setTo(10, 10);
    game.make.tween(nameText.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.None, true);

    rankText.visible = true;
    rankText.scale.setTo(10, 10);
    game.make.tween(rankText.scale).to({ x: 1, y: 1 }, 300, Phaser.Easing.Linear.None, true);
  }

  animateStage(stage) {
    game.make.tween(stage).to({ y: this.startY }, 500, Phaser.Easing.Bounce.Out, true);
  }
}
