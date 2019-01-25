import { Phaser,  Point } from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({ asset: 'cloud' });
    this.playerNumber = playerNumber;
    this.x = position[0];
    this.y = position[1];
    game.physics.arcade.enable(this);
    this.body.enable = true;

    this.settings = Config.playerInput[`player${playerNumber}`];
    this.gamePad = this.game.input.gamepad[`pad${playerNumber}`];
    this.controller = new Controller(game, this, this.gamePad, this.settings);


    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point(0,0);

    this.rotationSpeed = 2;
    this.currentMovementSpeed = 0;;
    this.movementSpeedStep = 0.02;
    this.maxMovementSpeed = 2;
  }

  onCollide() {
  }

  update() {
    this.controller.update();
    this.rotate();
    this.currentDirection.normalize();

    if (this.targetDirection.getMagnitude() > 0.2) {
      if (this.currentDirection.getMagnitude() < 0.2) {
        this.currentDirection.x = this.targetDirection.x;
        this.currentDirection.y = this.targetDirection.y;
        this.currentDirection.normalize();
      }

      this.currentMovementSpeed += this.movementSpeedStep;
    } else {

      this.currentMovementSpeed -= this.movementSpeedStep * 3;
    }

    this.currentMovementSpeed = Phaser.Math.clamp(this.currentMovementSpeed, 0, this.maxMovementSpeed);
    this.currentDirection.multiply(this.currentMovementSpeed, this.currentMovementSpeed);

    this.x += this.currentDirection.x;
    this.y += this.currentDirection.y;
  }

  rotate() {
    if (this.targetDirection.x * this.currentDirection.y > this.targetDirection.y * this.currentDirection.x) {
      this.currentDirection.rotate(0, 0, -this.rotationSpeed, true);
    } else {
      this.currentDirection.rotate(0, 0, this.rotationSpeed, true);
    }
  }

  moveUp() {

  }

  moveDown() {

  }

  moveLeft() {

  }

  moveRight() {

  }

  shoot() {

  }
}
