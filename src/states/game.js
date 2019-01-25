import { State, Phaser } from 'phaser';
import lang from '../lang';
import Background from '../sprites/background'
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import Image from '../services/image';
import CollisionManager from '../sprites/collisionManager';
import Slug from '../sprites/slug';
import Shell from '../sprites/shell';
import ColliderGroup from "../sprites/colliderGroup";
import GameManager from '../services/gameManager';
import CountDownText from '../sprites/countDownText';

export default class extends State {
  init() {
    this.game.input.maxPointers = 2;
    game.input.gamepad.start();
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  preload() {
    LocalizationManager.instance.loadLanguagePackage();
  }

  create() {
    this.background = new Background(0,0);
    game.add.existing(this.background);
    this.colliderGroup = new ColliderGroup();
    game.debug.text('Click to disable body1', 32, 32);
    this.colliderGroup.render()
    const bannerText = lang.text('welcome');
    const banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false,
    });

    banner.padding.set(10, 16);
    banner.anchor.setTo(0.5);
    if (__DEV__) {
      const zKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
      const xKey = game.input.keyboard.addKey(Phaser.KeyCode.X);
      const cKey = game.input.keyboard.addKey(Phaser.KeyCode.C);
      const vKey = game.input.keyboard.addKey(Phaser.KeyCode.V);
      const bKey = game.input.keyboard.addKey(Phaser.KeyCode.B);
      const qKey = game.input.keyboard.addKey(Phaser.KeyCode.Q);

      zKey.onDown.add(() => {
        console.log("teste")
        GameManager.instance.pickUpShell(1);
      });
      xKey.onDown.add(() => {
        GameManager.instance.pickUpShell(2);
      });
      cKey.onDown.add(() => {
        GameManager.instance.pickUpShell(3);
      });
      vKey.onDown.add(() => {
        GameManager.instance.pickUpShell(4);
      });
      bKey.onDown.add(() => {
        GameManager.instance.dropShell();
      });
      qKey.onDown.add(() => {
        GameManager.instance.startGame();
      });
    }
    this.collisionManager = new CollisionManager();
    this.buildSlugs();
    this.buildShell();
  }

  buildSlugs() {
    for (let i = 0; i < 4; i += 1) {
      const slug = new Slug(i + 1, [i * 200, i * 200]);
      game.add.existing(slug);
    }
  }

  buildShell() {
    const shell = new Shell([800, 400]);
    game.add.existing(shell);
  }

  update() {
    GameManager.instance.update();

  }

  render() {
    this.collisionManager.render();
  }
}
