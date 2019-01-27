import { Group, Point, Phaser } from 'phaser';
import Image from '../services/image';
import GameManager from '../services/gameManager';
import SoundEffects from '../services/soundEffects';
import CollisionManager from './collisionManager';

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
      position: new Point(3597 / 2 + game.width, game.height / 2 + 50),
    });

    this.vs = new Image({
      key: 'vs',
      position: new Point(game.width / 2, game.height / 2 + 50),
    });

    this.name = new Image({
      key: 'PHTEVEN',
      position: new Point(game.width - 300, game.height * 0.7 + 50),
      scale: new Point(0.5, 0.5),
      anchor: new Point(1, 0.5),
    });

    this.everyoneHype = new Image({
      key: 'everyone_hype',
      position: new Point(200, game.height * 0.3 + 50),
      anchor: new Point(0, 0.5),
    });

    this.buffslug = new Image({
      key: 'buff-bill',
      position: new Point(game.width - 200, 450),
    });

    this.slug1 = new Image({
      key: 'slugB',
      position: new Point(200, 450),
      scale: new Point(2, 2),
    });

    this.slug2 = new Image({
      key: 'slugB',
      position: new Point(140, 450),
      scale: new Point(2, 2),
    });

    this.slug3 = new Image({
      key: 'slugB',
      position: new Point(170, 400),
      scale: new Point(2, 2),
    });

    this.slugGroup = new Phaser.Group(game);

    this.add(this.hypeBar);
    this.add(this.name);
    this.add(this.everyoneHype);
    this.add(this.buffslug);
    this.add(this.vs);
    this.slugGroup.add(this.slug3);
    this.slugGroup.add(this.slug2);
    this.slugGroup.add(this.slug1);
    this.add(this.slugGroup);
  }

  createTweens() {
    this.hypeBarTween = game.make.tween(this.hypeBar).to({ x: -3597 / 2 }, 2200, null, false);
    this.hypeBarTween.frameBased = true;
    this.hypeBarTween.onComplete.add(() => {
      GameManager.instance.togglePause();
      console.log('end hyper time: ', game.time.totalElapsedSeconds());
      this.visible = false;
    });

    this.buffslugTweenIn = game.make.tween(this.buffslug).to({ x: game.width - 200 }, 275, Phaser.Easing.Sinusoidal.InOut, false, 250, 0, false);
    this.buffslugTweenOut = game.make.tween(this.buffslug).to({ x: game.width + 200 }, 275, Phaser.Easing.Sinusoidal.InOut, false, 1250, 0, false);
    this.buffslugTweenIn.onComplete.add(() => {
      this.buffslugTweenOut.start();
    });
    this.buffslugTweenIn.frameBased = true;
    this.buffslugTweenOut.frameBased = true;

    this.nameTweenIn = game.make.tween(this.name).to({ x: game.width - 300 }, 275, Phaser.Easing.Sinusoidal.InOut, false, 250, 0, false);
    this.nameTweenOut = game.make.tween(this.name).to({ x: game.width + 500 }, 275, Phaser.Easing.Sinusoidal.InOut, false, 1250, 0, false);
    this.nameTweenIn.onComplete.add(() => {
      SoundEffects.instance.onYay();
      this.nameTweenOut.start();
    });
    this.nameTweenIn.frameBased = true;
    this.nameTweenOut.frameBased = true;

    this.vsTweenIn = game.make.tween(this.vs.scale).to({ x: 1, y: 1 }, 400, null, false);
    this.vsTweenOut = game.make.tween(this.vs.scale).to({ x: 0, y: 0 }, 250, Phaser.Easing.Cubic.Out, false, 1000);
    this.vsTweenIn.onComplete.add(() => {
      game.camera.shake(0.01, 100);

      this.vsTweenOut.start();
    });
    this.vsTweenIn.frameBased = true;
    this.vsTweenOut.frameBased = true;

    this.everyoneHypeTweenIn = game.make.tween(this.everyoneHype).to({ x: 200 }, 275, Phaser.Easing.Sinusoidal.InOut, false, 250, 0, false);
    this.everyoneHypeTweenOut = game.make.tween(this.everyoneHype).to({ x: -500 }, 275, Phaser.Easing.Sinusoidal.InOut, false, 1250, 0, false);
    this.everyoneHypeTweenIn.onComplete.add(() => {
      this.everyoneHypeTweenOut.start();
    });
    this.everyoneHypeTweenIn.frameBased = true;
    this.everyoneHypeTweenOut.frameBased = true;

    this.slug1TweenIn = game.make.tween(this.slugGroup).to({ x: 0 }, 300, Phaser.Easing.Sinusoidal.InOut, false, 250, 0, false);
    this.slug1TweenOut = game.make.tween(this.slugGroup).to({ x: -300 }, 300, Phaser.Easing.Sinusoidal.InOut, false, 1250, 0, false);
    this.slug1TweenIn.onComplete.add(() => {
      this.slug1TweenOut.start();
    });

    this.slug1TweenIn.frameBased = true;
    this.slug1TweenOut.frameBased = true;
  }

  update() {
    game.world.bringToTop(this);
  }

  start(name) {
    game.world.bringToTop(this);
    GameManager.instance.togglePause();
    this.setTexture(name);
    this.setName(name);
    this.setSlugs(name);
    setTimeout(() => {
      this.visible = true;
      this.hypeBar.x = 3597 / 2 + game.width;
      this.hypeBarTween.start();
      console.log(this.hypeBarTween);
      console.log('before hyper time: ', game.time.totalElapsedSeconds());

      this.buffslug.x = game.width + 200;
      this.buffslugTweenIn.start();

      this.name.x = game.width + 500;
      this.nameTweenIn.start();
      SoundEffects.instance.onSwoosh();
      this.vs.visible = false;
      game.time.events.add(500, this.startVSAnimation, this);

      this.everyoneHype.x = -500;
      this.everyoneHypeTweenIn.start();

      this.slugGroup.x = -300;
      this.slug1TweenIn.start();
    }, 50);
  }

  startVSAnimation() {
    this.vs.visible = true;
    this.vs.scale.setTo(9, 9);
    this.vsTweenIn.start();
  }

  setTexture(name) {
    this.buffslug.loadTexture(`${name}_buffed`);
  }

  setName(name) {
    this.name.loadTexture(name.toUpperCase());
  }

  setSlugs(name) {
    let step = 0;
    for (let i = 0; i < CollisionManager.instance.slugs.length; i += 1) {
      if (CollisionManager.instance.slugs[i].name === name) continue;
      this.slugGroup.children[step].loadTexture(`slug${CollisionManager.instance.slugs[i].color.charAt(0).toUpperCase()}`);
      this.slugGroup.children[step].visible = true;
      step += 1;
    }

    for (;step < 3; step += 1) {
      this.slugGroup.children[step].visible = false;
    }
  }
}
