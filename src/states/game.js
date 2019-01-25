import { State } from 'phaser';
import lang from '../lang';
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import Character from '../TestSlug'

export default class extends State {
  init() {
    this.game.input.maxPointers = 2;
    this.testCharacter = new Character(1);
  }

  preload() {
    LocalizationManager.instance.loadLanguagePackage();
  }

  create() {
    const bannerText = lang.text('welcome');
    const banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false,
    });

    banner.padding.set(10, 16);
    banner.anchor.setTo(0.5);
  }

  render() {
  }
}
