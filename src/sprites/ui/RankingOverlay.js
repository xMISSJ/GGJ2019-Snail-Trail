import Phaser from 'phaser';
import Sprite from '../../services/sprite';
import Text from '../../services/text';
import GameManager from '../../services/gameManager';

export default class RankingOverlay extends Phaser.Group {
  constructor() {
    super(game);
    this.startY = game.height - 100;
    this.rankingStages = ['stage1', 'stage2', 'stage3'];
    this.spriteNames = ['slugG', 'slugM', 'slugO', 'slugB'];
    this.slugNames = ['Bill', 'Phteven', 'Carl', 'Frank'];
    this.rankingPositions = [game.width / 2, game.width / 2 - 210, game.width / 2 + 210, game.width / 2 + 420]
    this.rankingScores = [];
    // this.victoryPoses = [];
    for(let i = 0; i < game.totalPlayers; i += 1) {
      this.createStage(i, this.rankingPositions[i]);
    }
  }

  createStage(index, posX) {
    let rankingStage;
    if(index !== 3) {
      rankingStage = game.add.sprite(posX, this.startY, `${this.rankingStages[index]}`);
      rankingStage.scale.setTo(2.8);
      rankingStage.anchor.setTo(0.5, 1);
      this.add(rankingStage);
    }

    const ySnailOffset = index === 3 ? 0 : rankingStage.height;
    const slug = game.add.sprite(posX, this.startY - ySnailOffset + 30, `${this.spriteNames[GameManager.instance.leaderboard[index] - 1]}`);
    slug.anchor.setTo(0.5, 1);
    slug.scale.setTo(2, 2);
    this.add(slug);

    const nameText = new Text({ text: this.slugNames[GameManager.instance.leaderboard[index] - 1], position: new Phaser.Point(posX, this.startY - ySnailOffset - 100), fontSize: 20, color: '#FFFFFF' });
    this.add(nameText);

    const rankText = new Text({ text: `#${index + 1}`, position: new Phaser.Point(posX, this.startY - ySnailOffset - 150), fontSize: 20, color: '#FFFFFF' });
    this.add(rankText);
  }
}
