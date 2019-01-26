import { Group } from 'phaser';

import BigSmoke from './explosionSmoke';
export default class extends Phaser.Group {
  constructor(explosionType, x, y) {
    super(game);
    this.point = new Phaser.Point(x,y);
    this.type = explosionType;
    this.explosionTypes = {
      SMALL: {
        explosionRadius: 50,
        explosionFreezeTime: 0.5,
        smokeScale: 1,
      },
      BIG: {
        explosionRadius: 50,
        explosionFreezeTime: 0.5,
        smokeScale: 2.5,
      },
    };
  }

  start() {
    this.smoke = new BigSmoke(this.point.x, this.point.y);
    this.smoke.start(this.explosionTypes[this.type].smokeScale);
  }

  explode(explostionType, charactersToIgnore) {
    for (let i = 0; i < game.slugs.length; i++) {
      const slug = game.slugs[i];
      if (slug.playerNumber === charactersToIgnore.playerNumber) continue;
    }
  }
}
