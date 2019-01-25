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

    this.createSlug();
  }

  createSlug() {
    this.player = game.add.sprite(32, 24, 'slug', 1);
    this.player.smoothed = false;

    this.moving = this.player.animations.add('moving', [0, 3], 10, true);
    // this.idle = this.player.animations.add('idle', [0,3], 10, true);
  }

  onCollide() {
    console.log('collide');
  }

  update() {
    this.controller.update();

    // Checks for the movements of the gamePad stick.
    this.checkLeft = this.gamePad.isDown(Gamepad.XBOX360_DPAD_LEFT) || this.gamePad.axis(Gamepad.XBOX360_STICK_LEFT_X) < -0.1;
    this.checkRight = this.gamePad.isDown(Gamepad.XBOX360_DPAD_RIGHT) || this.gamePad.axis(Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
    this.checkUp = this.gamePad.isDown(Gamepad.XBOX360_DPAD_UP) || this.gamePad.axis(Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;
    this.checkDown = this.gamePad.isDown(Gamepad.XBOX360_DPAD_DOWN) || this.gamePad.axis(Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;

    // Checks whether gamePad is being used.
    if (this.checkLeft || this.checkRight || this.checkUp || this.checkDown) {
      this.player.play('moving');
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
}
