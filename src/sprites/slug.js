import { Point } from 'phaser';
import Sprite from '../services/sprite';

export default class Slug extends Sprite {
  constructor(position) {
    super({ asset: 'cloud', anchorX: 0, anchorY: 0 });

    this.x = position[0];
    this.y = position[1];
    game.physics.arcade.enable(this);
    this.body.enable = true;
    this.body.setCircle(100, 0, 0);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    this.body.moves = false;
  }

  update() {

  }
  onCollide(entity1, entity2) {

  }
}
