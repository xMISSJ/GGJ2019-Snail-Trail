import Phaser from 'phaser';

export default class Sprite extends Phaser.Sprite {
  constructor ({asset, x, y, frame, anchorX = 0.5, anchorY = 0.5, inputEnabled = false, scaleX = 1, scaleY = 1}) {
    super(game, x, y, asset, frame);

    this.game = game;
    this.autoCull = true;
    this.anchor.setTo(anchorX, anchorY);
    this.scale.setTo(scaleX, scaleY);
    this.inputEnabled = inputEnabled;
    this.smoothed = true;
  }

  center () {
    this.x += this.width / 2;
    this.y += this.height / 2;
  }
}
