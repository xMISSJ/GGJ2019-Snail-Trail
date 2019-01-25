import Sprite from '../services/sprite';

export default class extends Sprite {
  constructor (x, y) {
    super({asset: 'background', x: x, y: y, anchorX: 0, anchorY: 0})
    console.log("HELP?");
  }
}
