import { Group, Point } from 'phaser';
import Text from '../../services/text';
import Sprite from '../../services/sprite';

export default class Goal extends Group {
  constructor() {
    super(game);

    this.buildCrown();
    this.buildText();
  }

  buildCrown() {
    this.crown = new Sprite({
      asset: 'crown',
      x: 60,
      y: 30,
    });

    this.crown.scale.setTo(0.75,0.75)

    this.add(this.crown);
  }

  buildText() {
    this.text = new Text({
      text: '30s',
      position: new Point(150, 30),
      color: '#ffffff',
      strokeThickness: 10,
    });

    this.add(this.text)
  }
}
