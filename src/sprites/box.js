import Sprite from "../services/sprite";
import CollisionManager from "./collisionManager";

export default class Shell extends Sprite {
  constructor(x, y) {
    super({ asset: 'box', x, y, scaleX: 1, scaleY: 1 });
    this.tag = 'box'
    game.physics.p2.enable(this, true);
    this.shapeBox = this.body.setRectangle(this.width, this.height, 0);
    this.body.setRectangle(this.width - 10, this.height - 10, 0, 0, 0);
    this.shapeBox.sensor = true
    this.body.static = true;
    this.body.debug = true;
    CollisionManager.instance.addWall(this);
  }
}