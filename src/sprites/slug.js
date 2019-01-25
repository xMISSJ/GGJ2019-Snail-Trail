import { Point } from 'phaser';
import Sprite from '../services/sprite';

export default class Slug extends Sprite {
  constructor(position) {
    super({ asset: 'cloud'});

    this.x = position[0];
    this.y = position[1]
    game.physics.arcade.enable(this);
    this.body.enable = true;
  }

  onCollide() {
    console.log("collide")
  }
}
