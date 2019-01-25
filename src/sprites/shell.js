import { Group } from 'phaser';
import Sprite from '../services/sprite';
import SignalManager from '../services/signalManager';


export default class Shell extends Sprite {
  constructor(position) {
    super({ asset: 'cloud', x: position[0], y: position[1] });

    game.physics.arcade.enable(this);
    this.body.enable = true;
    this.body.setCircle(50, 0, 0);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = true;
    this.body.drag.setTo(100, 100)

    SignalManager.instance.dispatch('addShell', this);
  }

  onCollide() {
    if (!this.visible) return;

    this.visible = false;
  }
}
