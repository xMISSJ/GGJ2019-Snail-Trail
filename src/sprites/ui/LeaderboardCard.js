import Phaser from 'phaser';
import Sprite from '../../services/sprite';
import Text from '../../services/text';

export default class LeaderboardCard extends Phaser.Group {
  constructor(playerID, asset, x, y) {
    super(game);
    this.playerID = playerID;
    this.x = x;
    this.y = y;
    this.createCard(asset);
  }

  createCard(asset) {
    this.background = new Sprite({
      asset,
      anchorX: 0.5,
      anchorY: 0,
    });
    this.add(this.background);

    this.scoreText = new Text({
      text: '0:00',
      anchor: new Phaser.Point(0.5, 0.5),
      position: new Phaser.Point(0, this.background.height / 2),
      color: '#FFFFFF',
      fontSize: 18,
      strokeThickness: 4,
    });
    this.add(this.scoreText);
    this.setScore('0.00');

    this.bobTween = game.add.tween(this.scoreText).to({ y: (this.background.height / 2) - 3 }, 50, Phaser.Easing.Default, false).yoyo(true).loop(true);
  }

  setScore(score) {
    this.scoreText.text = score.toString().replace('.', ':');
  }
}
