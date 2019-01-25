import {State} from 'phaser';
import lang from '../lang';
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import Image from '../services/image';
import CollisionManager from '../sprites/collisionManager';
import Slug from '../sprites/slug';
import Shell from '../sprites/shell';

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

  render() {
    this.collisionManager.render();
  }
}
