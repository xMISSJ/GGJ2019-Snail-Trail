import Sprite from '../services/sprite';

export default class extends Sprite {
  constructor(x, y) {
    super({asset: 'smokeBig', x, y, anchorX: 0.5, anchorY: 0.5});
    game.add.existing(this);
    this.anim = this.animations.add('smokeBig', [0, 1, 2, 3], 10, false);
    this.anim.onComplete.add(() => {
      this.done();
    })

  }

  start(scale) {
    this.scale.set(scale,scale);
    this.visible = true;
    this.play('smokeBig');
  }

  done() {
    this.visible = false;
  }

}