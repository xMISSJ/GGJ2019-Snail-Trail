import Sprite from '../services/sprite';
import CollisionManager from './collisionManager';

export default class extends Sprite {
  constructor(x, y, number, color) {
    const numberOfSprite = 2;
    const randomSpriteNumber = Math.floor(Math.random() * numberOfSprite) + 1;

    super({ asset: `trailPart${randomSpriteNumber}`, x, y, anchorX: 0.5, anchorY: 0.5 });
    this.tint = color;
    this.alive = false;
    this.tag = `trail${number}`;
    this.lifetime = 2;
    this.currentLifetime = 2;
    this.standardScale = 1.3;
    this.scaleChange = 0.006;
    this.alphaChange = 0.006;

    this.randomAngleOffset = 65;
    this.randomPosOffset = 30;

    game.physics.p2.enable(this, true);
    this.body.data.sensor = true;
    this.body.enable = true;
    this.body.debug = false;
    this.circleShape = this.body.setCircle(20, 0, 0);
    this.visible = false;

    this.circleShape.sensor = true;

    CollisionManager.instance.addTrail(this);
  }

  spawnPart(x, y, angle) {
    CollisionManager.instance.addTrail(this);
    this.position.setTo(x, y);
    const randomXOffset = (Math.random() - 0.5) * this.randomPosOffset;
    const randomYOffset = (Math.random() - 0.5) * this.randomPosOffset;
    this.body.x = x + randomXOffset;
    this.body.y = y + randomYOffset;
    const randomAngleOffset = (Math.random() - 0.5) * this.randomAngleOffset;
    this.angle = angle + randomAngleOffset;
    this.currentLifetime = this.lifetime;
    this.scale.set(this.standardScale, this.standardScale);
    this.alive = true;
    this.visible = true;
    this.alpha = 1;
  }

  update() {
    if (!this.alive) return;
    this.currentLifetime -= game.time.elapsed / 1000;
    this.scale.x -= this.scaleChange;
    this.scale.y -= this.scaleChange;
    this.circleShape.radius -= this.scaleChange;
    this.body.shapeChanged();
    this.alpha -= this.alphaChange;

    if (this.alpha <= 0 || this.scale.x <= 0) {
      this.dead();
    }
  }

  dead() {
    this.alpha = 0;
    this.alive = false;
    this.visible = false;
    this.body.clearCollision()
  }
}
