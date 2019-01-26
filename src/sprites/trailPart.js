import Sprite from '../services/sprite';

export default class extends Sprite {
  constructor(x, y) {
    const numberOfSprite = 4;
    const randomSpriteNumber = Math.floor(Math.random() * numberOfSprite) + 1;

    super({ asset: `trailPart${randomSpriteNumber}`, x, y, anchorX: .5, anchorY: 0.5 });
    this.alive = false;
    this.lifetime = 2;
    this.currentLifetime = 2;
    this.standardScale = 2.5;
    this.scaleChange = 0.005;
    this.alphaChange = 0.005;
    this.pivot.y = -this.width;


  }

  spawnPart(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.currentLifetime = this.lifetime;
    this.alive = true;
    this.visible = true;
    this.scale.set(this.standardScale, this.standardScale);
    this.alpha = 1;
  }

  update() {
    if (!this.alive) return;
    this.currentLifetime -= game.time.elapsed/1000;

    if (this.currentLifetime < 0 ) {
      this.dead();
      this.alpha = 0;
      return;
    }
    this.scale.x -= this.scaleChange;
    this.scale.y -= this.scaleChange;
    this.alpha -= this.alphaChange;
    // todo smaller
    // todo alpha
  }

  dead() {
    this.alive = false;
    this.visible = false;
  }
}
