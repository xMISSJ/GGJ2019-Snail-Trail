import Sprite from "../services/sprite";
import CollisionManager from "./collisionManager";

export default class Shell extends Sprite {
  constructor(x, y) {
    super({ asset: 'box', x, y, scaleX: 1, scaleY: 1 });
    this.tag = 'box'
    game.physics.p2.enable(this, true);
    this.scaleSize = 2;
    this.shapeBox = this.body.setRectangle(this.width * this.scaleSize, this.height * this.scaleSize, 0);
    this.body.setRectangle(this.width * this.scaleSize, this.height * this.scaleSize, 0, 0, 0);
    this.scale.set(this.scaleSize, this.scaleSize)
    this.shapeBox.sensor = true
    this.body.static = true;
    this.body.debug = false;
    CollisionManager.instance.addWall(this);
  }
}