import Sprite from '../services/sprite';

export default class extends Sprite {
  constructor(x, y) {
    super({asset: `Flash`, x, y, anchorX: 0.5, anchorY: 0.5});

  }

  start() {
    this.play('movingSlug');
  }

  done() {

  }

}