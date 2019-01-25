import Slug from './slug';

export default class ColliderGroup extends Phaser.Group {
  constructor() {
    super(game);

    this.slugs = [];

    this.buildSlugs();
  }

  buildSlugs() {
    for (let i = 0; i < 4; i += 1) {
      const slug = new Slug([i * 100, i * 100]);

      this.slugs.push(slug);

      this.add(slug);
    }
  }

  update() {
    for (let i = 0; i < this.slugs.length; i += 1) {
      for (let j = i + 1; j < this.slugs.length; j += 1) {
        game.physics.arcade.overlap(this.slugs[i], this.slugs[j], this.slugs[i].onCollide, this.slugs[j].onCollide, this);
      }
    }
  }

  render() {
    for (let i = 0; i < this.slugs.length; i += 1) {
      game.debug.body(this.slugs[i])
    }
  }
}
