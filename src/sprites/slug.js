import {Point} from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({asset: 'cloud'});

    this.x = position[0];
    this.y = position[1];
    game.physics.arcade.enable(this);
    this.body.enable = true;
    this.body.setCircle(100, 0, 0);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    this.body.moves = false;

    this.settings = Config.playerInput.player1;
    this.gamePad = this.game.input.gamepad[`pad${playerNumber}`];
    this.controller = new Controller(game, this, this.gamePad, this.settings);


    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point();

    this.rotationSpeed = 1;
  }

  onCollide() {
  }

  update() {
    this.controller.update();

    console.log(this.currentDirection);
    //this.rotate(0.1);
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
