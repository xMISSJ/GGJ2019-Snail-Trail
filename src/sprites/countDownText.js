import Phaser from 'phaser';
import Text from '../services/text';

export default class CountDownText extends Text {
  constructor({ startValue, position, fontSize, anchor, color, stroke, strokeThickness }) {
    super({ text: startValue, position, fontSize, anchor, color, stroke, strokeThickness });
    this.startValue = startValue;
    this.timer = game.time.create(false);
  }

  start(callback, context) {
    this.timer = this.game.time.create(false);
    this.timer.add(this.startValue * 1000, () => {
      this.stop(callback, context);
    }, this);
    this.timer.start();
  }

  stop(callback, context) {
    callback.call(context);
    this.timer.stop();
  }

  update() {
    if(this.timer.seconds < this.startValue && this.timer.seconds !== 0) {
      this.text = this.startValue - Math.floor(this.timer.seconds);
    }
  }
}
