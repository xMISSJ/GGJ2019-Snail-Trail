import { State, Phaser } from 'phaser';
import lang from '../lang';
import Background from '../sprites/background';
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import Image from '../services/image';
import CollisionManager from '../sprites/collisionManager';
import Slug from '../sprites/slug';
import Shell from '../sprites/shell';
import ColliderGroup from '../sprites/colliderGroup';
import GameManager from '../services/gameManager';
import CountDownText from '../sprites/countDownText';
import Wall from '../sprites/wall';

export default class extends State {
  init() {
    this.game.input.maxPointers = 2;
    game.input.gamepad.start();
    game.world.setBounds(0, 0, 800, 800);
    game.physics.startSystem(Phaser.Physics.P2JS);
  }

  preload() {
    LocalizationManager.instance.loadLanguagePackage();
  }

  create() {
    this.background = new Background(0, 0);
    game.add.existing(this.background);

    if (__DEV__) {
      const zKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
      const xKey = game.input.keyboard.addKey(Phaser.KeyCode.X);
      const cKey = game.input.keyboard.addKey(Phaser.KeyCode.C);
      const vKey = game.input.keyboard.addKey(Phaser.KeyCode.V);
      const bKey = game.input.keyboard.addKey(Phaser.KeyCode.B);
      const qKey = game.input.keyboard.addKey(Phaser.KeyCode.Q);

      zKey.onDown.add(() => {
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
    this.buildWalls();
    this.buildShell();
    this.buildSlugs();
  }

  buildWalls() {
    const wall1 = new Wall([0, 350], [720, 100]);
    game.add.existing(wall1);
    const wall2 = new Wall([1280, 350], [720, 100]);
    game.add.existing(wall2);
    const wall3 = new Wall([640, 0], [100, 1280]);
    game.add.existing(wall3);
    const wall4 = new Wall([640, 720], [100, 1280]);
    game.add.existing(wall4);
  }

  buildSlugs() {
    for (let i = 0; i < 4; i += 1) {
      const slug = new Slug(i + 1, [i * 200 + 100, i * 200 + 100]);
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
    //this.collisionManager.render();
  }
}
