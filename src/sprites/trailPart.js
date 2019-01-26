import Sprite from '../services/sprite';

export default class extends Sprite {
  constructor (x, y) {
    super({asset: 'background', x: x, y: y, anchorX: 1, anchorY: 0})
    console.log("HELP?");
    this.alive = false;
    this.lifetime = 2;
  }

  setRotation() {

  }

  update() {
    if(!this.alive) return;
    // todo smaller
    // todo alpha
  }

  dead() {

  }
}
