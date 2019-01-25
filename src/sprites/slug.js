import { Point } from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';
import SignalManager from '../services/signalManager';

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({ asset: 'cloud', x: position[0], y: position[1] });

    this.states = { SLUG: 0, SNAIL: 1 };
    Object.freeze(this.state);

    this.maxHP = 3;

    this.switchState(this.states.SLUG);
    this.currentHP = this.maxHP;

    this.shell = null;

    game.physics.arcade.enable(this);
    this.body.enable = true;
    this.body.setCircle(100, 0, 0);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = true;
    this.body.drag.setTo(100, 100);

    this.settings = Config.playerInput.player1;
    this.gamePad = this.game.input.gamepad[`pad${playerNumber}`];
    this.controller = new Controller(game, this, this.gamePad, this.settings);

    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point();

    this.rotationSpeed = 1;
    SignalManager.instance.dispatch('addSlug', this);
  }

  onCollideSlug(entity1, entity2) {
    this.setVelocity(entity1, entity2, 100);

    this.removeHealth(entity1, entity2, 1);
  }

  setVelocity(entity1, entity2, magnitude) {
    const point = new Point();
    const difference = Point.subtract(entity1.position, entity2.position, point).normalize();
    this.body.velocity.setTo(difference.x * magnitude, difference.y * magnitude);
  }

  onCollideShell(entity1, entity2) {
    entity2.onCollide();
    this.switchState(this.states.SNAIL);

    this.shell = entity2;
  }

  removeHealth(entity1, entity2, value) {
    if (!this.isSnail) return;

    this.currentHP -= value;

    if (this.currentHP <= 0) {
      this.switchState(this.states.SLUG);

      this.setVelocity(entity1, entity2, 1000);
      if (this.shell) {
        this.shell.onSpawn(this.position);
        this.shell = null;
      }
    }
  }

  update() {
    this.controller.update();

    this.x += this.targetDirection.x;
    this.y += this.targetDirection.y;
  }

  moveUp() {

  }

  moveDown() {

  }

  moveLeft() {

  }

  moveRight() {

  }

  /* -----------------------------
   * States management
   ----------------------------- */

  switchState(state) {
    this.currentState = state;

    switch (this.currentState) {
      case this.states.SLUG:
        this.switchToSlug();
        break;
      case this.states.SNAIL:
        this.switchToSnail();
        break;
      default: console.warn('Something is wrong with ', this.currentState);
    }
  }

  get isSlug() {
    return this.currentState === this.states.SLUG;
  }

  get isSnail() {
    return this.currentState === this.states.SNAIL;
  }

  switchToSlug() {
    // TODO for testing purposes
    this.tint = 0xffffff;
    this.currentHP = 3;


  }

  switchToSnail() {
    // TODO for testing purposes
    this.tint = Math.random() * 0xffffff;
  }
}
