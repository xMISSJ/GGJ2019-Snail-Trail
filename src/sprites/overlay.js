import { Group, Point, Phaser } from 'phaser';
import Image from '../services/image';
import GameManager from '../services/gameManager';

export default class Overlay extends Group {
  constructor() {
    super(game);

    game.overlay = this;

    this.buildSprites();

    this.key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.key2.onDown.add(this.start, this);
    this.visible = false;
    this.createTweens();
  }

  buildSprites() {
    this.hypeBar = new Image({
      key: 'hype_bar',
      position: new Point(3597 / 2 + game.width, game.height / 2),
    });

    this.vs = new Image({
      key: 'vs',
      position: new Point(game.width / 2, game.height / 2),
    });

    this.name = new Image({
      key: 'PHTEVEN',
      position: new Point(game.width - 300, game.height * 0.7),
      scale: new Point(0.5, 0.5),
      anchor: new Point(1, 0.5),
    });

    this.everyoneHype = new Image({
      key: 'everyone_hype',
      position: new Point(200, game.height * 0.3),
      anchor: new Point(0, 0.5),
    });

    this.buffslug = new Image({
      key: 'buff-bill',
      position: new Point(game.width - 200, game.height / 2),
      scale: new Point(3, 3),
    });

    this.add(this.hypeBar);
    this.add(this.name);
    this.add(this.everyoneHype);
    this.add(this.buffslug);
    this.add(this.vs);
  }

  createTweens() {
    this.hypeBarTween = game.make.tween(this.hypeBar).to({ x: -3597 / 2 }, 800, null, false);
    this.hypeBarTween.onComplete.add(() => {
      console.log(GameManager.instance);
      GameManager.instance.togglePause();
      this.visible = false;
    });

    this.buffslugTweenIn = game.make.tween(this.buffslug).to({ x: game.width - 200 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
    this.buffslugTweenOut = game.make.tween(this.buffslug).to({ x: game.width + 200 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 1000, 0, false);
    this.buffslugTweenIn.onComplete.add(() => {
      this.buffslugTweenOut.start();
    });

    this.nameTweenIn = game.make.tween(this.name).to({ x: game.width - 300 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
    this.nameTweenOut = game.make.tween(this.name).to({ x: game.width + 500 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 1000, 0, false);
    this.nameTweenIn.onComplete.add(() => {
      this.nameTweenOut.start();
    });

    this.vsTweenIn = game.make.tween(this.vs.scale).to({ x: 1, y: 1 }, 200, null, false);
    this.vsTweenOut = game.make.tween(this.vs.scale).to({ x: 0, y: 0 }, 200, Phaser.Easing.Cubic.Out, false, 500);
    this.vsTweenIn.onComplete.add(() => {
      game.camera.shake(0.01, 100);

      this.vsTweenOut.start();
    });

    this.everyoneHypeTweenIn = game.make.tween(this.everyoneHype).to({ x: 200 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, false);
    this.everyoneHypeTweenOut = game.make.tween(this.everyoneHype).to({ x: -500 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 1000, 0, false);
    this.everyoneHypeTweenIn.onComplete.add(() => {
      this.everyoneHypeTweenOut.start();
    });
  }

  update() {
    game.world.bringToTop(this);
  }

  start() {
    GameManager.instance.togglePause();

    setTimeout(() => {
      this.visible = true;
      this.hypeBar.x = 3597 / 2 + game.width;
      this.hypeBarTween.start();

      this.buffslug.x = game.width + 200;
      this.buffslugTweenIn.start();

      this.name.x = game.width + 500;
      this.nameTweenIn.start();
      this.vs.visible = false;
      game.time.events.add(500, this.startVSAnimation, this);

      this.everyoneHype.x = -500;
      this.everyoneHypeTweenIn.start();
    }, 50);
  }

  startVSAnimation() {
    this.vs.visible = true;
    this.vs.scale.setTo(5, 5);
    this.vsTweenIn.start();
  }
}
