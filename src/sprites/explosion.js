import { Group } from 'phaser';

export default class extends Phaser.Group {
  constructor() {
    super(game);

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

  explode(explostionType, charactersToIgnore) {
    for (let i = 0; i < game.slugs.length; i++) {
      const slug = game.slugs[i];
      if (slug.playerNumber === charactersToIgnore.playerNumber) continue;
    }
  }
}
