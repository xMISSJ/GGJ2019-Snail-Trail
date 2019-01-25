import Slug from './slug';

export default class ColliderGroup extends Phaser.Group {
  constructor() {
    super(game);

    this.slugs = [];

    this.buildSlugs();
  }

  buildSlugs() {
    for (let i = 0; i < 4; i += 1) {
      const slug = new Slug([i * 200, i * 200]);

      this.slugs.push(slug);

      this.add(slug);
    }
  }

  update() {
    for (let i = 0; i < this.slugs.length; i += 1) {
      for (let j = 0; j < this.slugs.length; j += 1) {
        if (i === j) continue;
        game.physics.arcade.overlap(this.slugs[i], this.slugs[j], this.slugs[i].onCollide, this.slugs[j].onCollide, this.slugs[i]);
      }
    }
  }

  render() {
    for (let i = 0; i < this.slugs.length; i += 1) {
      game.debug.body(this.slugs[i])
    }
  }
}
