import {Group} from 'phaser';
import SignalManager from '../services/signalManager';
import Singleton from "../services/singleton";

export default class CollisionManager extends Singleton {
  constructor() {
    super(game);

    this.slugs = [];
    this.shell = null;
    this.walls = [];
    this.trails = [];

    this.wallsP2Group = game.physics.p2.createCollisionGroup();
    this.slugsP2Group = game.physics.p2.createCollisionGroup();
    this.shellP2Group = game.physics.p2.createCollisionGroup();
    this.trailsP2Group = game.physics.p2.createCollisionGroup();
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

  addWall(entity) {
    this.walls.push(entity);
    this.setPhysicsWall(entity)
  }

  addTrail(entity) {
    console.log(entity)
    this.trails.push(entity);

    this.setPhysicsTrail(entity);
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
    entity.body.collides(this.wallsP2Group);
    entity.body.collideWorldBounds = true;
  }

  setPhysicsShell(entity) {
    entity.body.setCollisionGroup(this.shellP2Group)
    entity.body.collides([this.slugsP2Group, this.shellP2Group]);
  }

  setPhysicsWall(entity) {
    entity.body.setCollisionGroup(this.wallsP2Group);
    entity.body.collides(this.slugsP2Group);
  }

  setPhysicsTrail(entity) {
    entity.body.setCollisionGroup(this.trailsP2Group);
    entity.body.collides(this.slugsP2Group);
  }

  render() {
    if (this.shell && this.shell.visible) {
      game.debug.body(this.shell);
    }
  }
}
