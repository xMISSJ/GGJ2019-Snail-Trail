import Phaser from 'phaser';
import Sprite from '../../services/sprite';
import Text from '../../services/text';

export default class RankingOverlay extends Phaser.Group {
  constructor() {
    super(game);
    this.rankingPositions = [];
    this.rankingScores = [];
    // this.victoryPoses = [];

    console.log('Overlay displayed');
  }



  update() {

  }
}
