import { Point } from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({ asset: 'cloud' });

    this.x = position[0];
    this.y = position[1];

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
  }

  onCollide(entity1, entity2) {
    var point = new Point()
    const difference = Point.subtract(entity1.position, entity2.position, point).normalize();

    this.body.velocity.setTo(difference.x * 100, difference.y * 100);
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
}
