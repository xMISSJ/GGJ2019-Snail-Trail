import { Point } from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';
import SignalManager from "../services/signalManager";

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({ asset: 'cloud', x: position[0], y: position[1] });

    this.states = { SLUG: 0, SNAIL: 1 };
    Object.freeze(this.state);

    this.currentState = this.states.SLUG;
    this.maxHP = 3;
    this.currentHP = this.maxHP;

    game.physics.arcade.enable(this);
    this.body.enable = true;
    this.body.setCircle(100, 0, 0);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = true;
    this.body.drag.setTo(100, 100)


    this.settings = Config.playerInput.player1;
    this.gamePad = this.game.input.gamepad[`pad${playerNumber}`];
    this.controller = new Controller(game, this, this.gamePad, this.settings);


    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point();

    this.rotationSpeed = 1;
    SignalManager.instance.dispatch('addSlug', this, "test 1", "test 2");
  }

  onCollideSlug(entity1, entity2) {
    const point = new Point()
    const difference = Point.subtract(entity1.position, entity2.position, point).normalize();

    this.body.velocity.setTo(difference.x * 100, difference.y * 100);

    this.removeHealth(1);
  }

  onCollideShell(entity1, entity2) {
    console.log("collision with the shell")
    entity2.onCollide();
    this.switchState(this.states.SNAIL)
  }

  removeHealth(value) {
    this.currentHP -= value;
    console.log(this.currentHP)
    if (this.currentHP <= 0) {
      this.switchState(this.states.SLUG);
      // TODO unequip shell
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

  switchState(state) {
    this.currentState = state;

    switch(this.currentState) {
      case this.states.SLUG:
        this.switchToSlug();
        break;
      case this.states.SNAIL:
        this.switchToSnail();
        break;
    }
  }

  switchToSlug() {
    // TODO for testing purposes
    this.scale.setTo(1, 1);
    this.currentHP = 3;
  }

  switchToSnail() {
    // TODO for testing purposes
    console.log("switch to snail")
    this.scale.setTo(1.3, 1.3);
  }
}
