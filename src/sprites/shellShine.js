import Phaser from 'phaser';
import Sprite from '../services/sprite';

export default class shellShine extends Sprite {
  constructor() {
    super({ asset: 'shellShine', x: 0, y: 0, scaleX: 0.7, scaleY: 0.7 });

    this.alpha = (0.3);

    this.secondShine = new Sprite({ asset: 'shellShine', x: 0, y: 0, scaleX: 1.3, scaleY: 1.3 });
    this.secondShine.alpha = 0.2;
    this.addChild(this.secondShine);
  }

  onShellDrop(shellPosition) {
    this.x = shellPosition.x;
    this.y = shellPosition.y;
    this.visible = true;
  }

  onShellPickUp() {
    this.visible = false;
  }

  update() {
    if(this.visible === false) return;
    this.angle += 1;
    this.secondShine.angle -= 1.5;
  }
}