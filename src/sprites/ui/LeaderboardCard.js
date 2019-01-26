import Phaser from 'phaser';
import Sprite from '../../services/sprite';
import Text from '../../services/text';

export default class LeaderboardCard extends Phaser.Group {
  constructor(playerID, x, y) {
    super(game);
    this.playerID = playerID;
    this.x = x;
    this.y = y;
    this.createCard(x, y);
  }

  createCard(x, y) {
    this.background = new Sprite({
      asset: 'loaderBg',
      scaleX: 0.7,
      anchorX: 0.5,
      anchorY: 0,
    });
    this.add(this.background);

    this.scoreText = new Text({
      text: this.playerID + ':   0.00',
      anchor: new Phaser.Point(0.5, 0),
    });
    this.add(this.scoreText);
  }

  setScore(score) {
    this.scoreText.text = this.playerID + ':   ' + score;
  }
}