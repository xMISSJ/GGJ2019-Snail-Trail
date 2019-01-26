import Sprite from '../services/sprite';
import SignalManager from '../services/signalManager';

export default class Wall extends Sprite {
  constructor(position, size) {
    super({ x: position[0], y: position[1] });


    game.physics.p2.enable(this, true);
    this.body.enable = true;
    this.body.clearShapes();
    this.body.setRectangle(size[0], size[1], 10, 0, 0);
    this.body.fixedRotation = true;
    this.body.angle = 90;
    this.body.collideWorldBounds = true;
    this.body.static = true;
    this.body.debug = true;

    SignalManager.instance.dispatch('addWall', this);
  }
}
