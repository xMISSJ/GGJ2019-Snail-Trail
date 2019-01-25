import { State } from 'phaser';
import lang from '../lang';
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import Image from '../services/image';
import Slug from '../sprites/slug';
import ColliderGroup from "../sprites/colliderGroup";

export default class extends State {
  init() {
    this.game.input.maxPointers = 2;
    game.input.gamepad.start();
    console.log( game.input.gamepad);
    game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  preload() {
    LocalizationManager.instance.loadLanguagePackage();
  }

  create() {
    this.colliderGroup = new ColliderGroup();
  }

  render() {
    game.debug.text('Click to disable body1', 32, 32);
    this.colliderGroup.render()
  }
}
