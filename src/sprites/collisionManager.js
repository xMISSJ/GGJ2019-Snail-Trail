import { Group } from 'phaser';
import SignalManager from '../services/signalManager';

export default class CollisionManager extends Group {
  constructor() {
    super(game);

    this.slugs = [];
    this.shells = [];

    SignalManager.instance.add('addSlug', this.addSlug, this);
    SignalManager.instance.add('addShell', this.addShell, this);
  }

  /* -----------------------------
   * Adding and removing entities
   ----------------------------- */
  addSlug(entity, test1, test2) {
    this.slugs.push(entity);
  }

  addShell(entity) {
    this.shell.push(entity);
  }

  removeShell(entity) {
    const index = this.shells.indexOf(entity);

    if (index > -1) {
      this.shells.splice(index, 1);
    }
  }

  /* -----------------------------
   * Collision checker
   ----------------------------- */

  update() {
    for (let i = 0; i < this.slugs.length; i += 1) {
      this.slugs[i].update();
    }

    for (let i = 0; i < this.slugs.length; i += 1) {
      for (let j = 0; j < this.slugs.length; j += 1) {
        if (i === j) continue;
        game.physics.arcade.overlap(
          this.slugs[i],
          this.slugs[j],
          this.slugs[i].onCollide,
          null,
          this.slugs[i],
        );
      }
    }
  }

  render() {
    for (let i = 0; i < this.slugs.length; i += 1) {
      game.debug.body(this.slugs[i]);
    }
  }
}
