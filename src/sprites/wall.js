import Sprite from '../services/sprite';
import SignalManager from '../services/signalManager';
import CollisionManager from "./collisionManager";

export default class Wall extends Sprite {
  constructor(position, size) {
    super({ x: position[0], y: position[1] });


    game.physics.p2.enable(this, true);
    this.tag = 'wall'
    this.body.enable = true;
    this.body.clearShapes();
    this.body.setRectangle(size[0], size[1], 10, 0, 0);
    this.body.fixedRotation = true;
    this.body.angle = 90;
    this.body.collideWorldBounds = true;
    this.body.static = true;
    this.body.debug = true;

    CollisionManager.instance.addWall(this);
    // SignalManager.instance.dispatch('addWall', this);
  }
}
