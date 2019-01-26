import { Group } from 'phaser';
import Sprite from '../services/sprite';
import SignalManager from '../services/signalManager';
import CollisionManager from "./collisionManager";


export default class Shell extends Sprite {
  constructor(position) {
    super({ asset: 'snailhouse', x: position[0], y: position[1], scaleX: 1.5, scaleY: 1.5 });

    this.states = { PICKABLE: 0, PICKEDUP: 1, SPAWN: 2 };
    Object.freeze(this.state);
    this.tag = "shell";

    this.currentState = this.states.PICKABLE;
    //this.switchState(this.states.PICKABLE);

    game.physics.p2.enable(this, true);
    this.body.data.sensor = true
    this.body.enable = true;
    this.circleShape = this.body.setCircle(40, 0, 0);

    this.circleShape.sensor = true
    this.body.debug = false;

    CollisionManager.instance.addShell(this);
    // SignalManager.instance.dispatch('addShell', this);
  }

  onCollide() {
    if (!this.isPickable) return;
    this.switchState(this.states.PICKEDUP);
  }

  onSpawn(position) {
    this.switchState(this.states.SPAWN);
    this.position.setTo(position.x, position.y);
    this.body.x = position.x;
    this.body.y = position.y;
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

    CollisionManager.instance.addShell(this);
  }

  switchToPickUp() {
    // TODO for testing purposes
    this.visible = false;
    this.body.clearCollision()
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
