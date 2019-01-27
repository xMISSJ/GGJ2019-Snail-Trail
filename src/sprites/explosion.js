import { Group } from 'phaser';

import BigSmoke from './explosionSmoke';
import CollisionManager from './collisionManager';

export default class extends Phaser.Group {
  constructor(explosionType, position) {
    super(game);
    this.point = new Phaser.Point(position.x, position.y);
    this.type = explosionType;
    this.explosionTypes = {
      SMALL: {
        explosionRadius: 300,
        explosionFreezeTime: 0.2,
        explosionForce: 1,
        smokeScale: 1,
      },
      MEDIUM: {
        explosionRadius: 400,
        explosionFreezeTime: 0.1,
        explosionForce: 4,
        smokeScale: 1,
      },
      BIG: {
        explosionRadius: 500,
        explosionFreezeTime: 0.4,
        explosionForce: 4,
        smokeScale: 2.5,
      },
    };
  }

  start(array) {
    game.camera.shake(0.05, 200);
    this.smoke = new BigSmoke(this.point.x, this.point.y);
    this.smoke.start(this.explosionTypes[this.type].smokeScale);
    this.explode(array);
  }

  explode(charactersToIgnore) {
    for (let i = 0; i < CollisionManager.instance.slugs.length; i += 1) {
      const index = charactersToIgnore.findIndex(x => x === CollisionManager.instance.slugs[i]);

      if (index === -1) {
        CollisionManager.instance.slugs[i].explode(this.point, this.explosionTypes[this.type]);
      }
    }
  }
}
