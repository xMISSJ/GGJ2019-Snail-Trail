import Phaser from 'phaser';
import Controller from './services/Controller';
import Config from './config';

export default class character extends Phaser.Sprite {
  constructor({ playerNumber }) {
    super(game, 200, 200, 'loaderBar');

    this.settings = Config.playerInput.player1;
    this.gamePad = this.game.input.gamepad.pad1;
    console.log(this.gamePad);
    this.controller = new Controller(game, this, this.gamePad, this.settings);
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
