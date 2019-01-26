import { Group } from 'phaser';

import BigSmoke from './explosionSmoke';
export default class extends Phaser.Group {
  constructor(explosionType, x, y) {
    super(game);
    this.point = new Phaser.Point(x,y);
    this.explostionTypes = {
      SMALL: {
        explosionRadius: 50,
        explosionFreezeTime: 0.5,
      },
      BIG: {
        explosionRadius: 50,
        explosionFreezeTime: 0.5,
      },
    };
  }

  start() {
    this.smoke = new BigSmoke(this.point.x, this.point.y);
    this.smoke.start();
  }

  explode(explostionType, charactersToIgnore) {
    for (let i = 0; i < game.slugs.length; i++) {
      const slug = game.slugs[i];
      if (slug.playerNumber === charactersToIgnore.playerNumber) continue;
    }
  }
}
