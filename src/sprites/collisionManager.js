import {Group} from 'phaser';
import SignalManager from '../services/signalManager';

export default class CollisionManager extends Group {
  constructor() {
    super(game);

    this.slugs = [];
    this.shell = null;
    this.slugsP2Group = game.physics.p2.createCollisionGroup();
    this.shellP2Group = game.physics.p2.createCollisionGroup();
    SignalManager.instance.add('addSlug', this.addSlug, this);
    SignalManager.instance.add('addShell', this.addShell, this);
  }

  /* -----------------------------
   * Adding and removing entities
   ----------------------------- */
  addSlug(entity) {
    this.slugs.push(entity);

    this.setPhysicsSlugs(entity);
  }

  addShell(entity) {
    this.shell = entity;

    this.setPhysicsShell(entity)
  }

  removeShell(entity) {
    // const index = this.shells.indexOf(entity);
    //
    // if (index > -1) {
    //   this.shells.splice(index, 1);
    // }
  }

  /* -----------------------------
   * Collision checker
   ----------------------------- */

  setPhysicsSlugs(entity) {
    entity.body.setCollisionGroup(this.slugsP2Group);
    entity.body.collides(this.shellP2Group, entity.onCollideShell, entity);
    entity.body.collides(this.slugsP2Group, entity.onCollideSlug, entity);
  }

  setPhysicsShell(entity) {
    entity.body.setCollisionGroup(this.shellP2Group)
    entity.body.collides([this.slugsP2Group, this.shellP2Group]);
  }


  render() {
    if (this.shell && this.shell.visible) {
      game.debug.body(this.shell);
    }
  }
}
