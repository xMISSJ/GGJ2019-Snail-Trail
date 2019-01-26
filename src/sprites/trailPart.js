import Sprite from '../services/sprite';

export default class extends Sprite {
  constructor(x, y) {
    const numberOfSprite = 2;
    const randomSpriteNumber = Math.floor(Math.random() * numberOfSprite) + 1;

    super({ asset: `trailPart${randomSpriteNumber}`, x, y, anchorX: .5, anchorY: 0.5 });
    this.alive = false;
    this.lifetime = 2;
    this.currentLifetime = 2;
    this.standardScale = 1;
    this.scaleChange = 0.0015;
    this.alphaChange = 0.0015;

    this.randomAngleOffset = 65;
    this.visible = false;


  }

  spawnPart(x, y, angle) {
    this.x = x;
    this.y = y;
    var randomAngleOffset = (Math.random() - 0.5) *this.randomAngleOffset;
    this.angle = angle + randomAngleOffset;
    this.currentLifetime = this.lifetime;
    this.scale.set(this.standardScale, this.standardScale);
    this.alive = true;
    this.visible = true;
    this.alpha = 1;
  }

  update() {
    if (!this.alive) return;
    this.currentLifetime -= game.time.elapsed/1000;
    this.scale.x -= this.scaleChange;
    this.scale.y -= this.scaleChange;

    this.alpha -= this.alphaChange;

    if (this.alpha <= 0 || this.scale.x <= 0) {
      this.dead();
    }
  }

  dead() {
    this.alpha = 0;
    this.alive = false;
    this.visible = false;
  }
}
