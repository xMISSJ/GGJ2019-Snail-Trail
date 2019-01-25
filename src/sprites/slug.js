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

    this.settings = Config.playerInput.player1;
    this.gamePad = this.game.input.gamepad.pad1;
    this.controller = new Controller(game, this, this.gamePad, this.settings);
  }

  onCollide() {
    console.log('collide');
  }

  update() {
    this.controller.update();
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
