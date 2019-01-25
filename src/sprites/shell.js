import { Group } from 'phaser';
import Sprite from '../services/sprite';
import SignalManager from '../services/signalManager';


export default class Shell extends Sprite {
  constructor(position) {
    super({ asset: 'cloud', x: position[0], y: position[1], scaleX: 0.5, scaleY: 0.5 });

    this.states = { PICKABLE: 0, PICKEDUP: 1, SPAWN: 2 };
    Object.freeze(this.state);

    this.switchState(this.states.PICKABLE);

    game.physics.arcade.enable(this);
    this.body.enable = true;
    this.body.setCircle(100, 0, 0);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = true;
    this.body.drag.setTo(20, 20);

    SignalManager.instance.dispatch('addShell', this);
  }

  onCollide() {
    if (!this.isPickable) return;
    this.switchState(this.states.PICKEDUP);
  }

  onSpawn(position) {
    this.switchState(this.states.SPAWN);

    this.position.setTo(position.x, position.y);
    this.body.velocity.setTo(Math.random() * 100 - 50, Math.random() * 100 - 50);
  }
  /* -----------------------------
   * States management
   ----------------------------- */

  switchState(state) {
    this.currentState = state;

    switch (this.currentState) {
      case this.states.PICKABLE:
        this.switchToPickable();
        break;
      case this.states.PICKEDUP:
        this.switchToPickUp();
        break;
      case this.states.SPAWN:
        this.switchToSpawn();
        break;
      default: console.warn('Something is wrong with ', this.currentState);
    }
  }

  get isPickable() {
    return this.currentState === this.states.PICKABLE;
  }

  get isPickedUp() {
    return this.currentState === this.states.PICKEDUP;
  }

  get isSpawn() {
    return this.currentState === this.states.SPAWN;
  }

  switchToPickable() {
    // TODO for testing purposes
    this.tint = 0xffffff;
    this.visible = true;
  }

  switchToPickUp() {
    // TODO for testing purposes
    this.visible = false;
  }

  switchToSpawn() {
    // TODO for testing purposes
    this.tint = Math.random() * 0xffffff;
    this.visible = true;

    setTimeout(() => {
      this.switchState(this.states.PICKABLE);
    }, 2000);
  }
}
