import { State, Phaser } from 'phaser';
import lang from '../lang';
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import GameManager from '../services/gameManager';

export default class extends State {
  init() {
    this.game.input.maxPointers = 2;
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

    GameManager.instance.startGame();

    if (__DEV__) {
      const zKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
      const xKey = game.input.keyboard.addKey(Phaser.KeyCode.X);
      const cKey = game.input.keyboard.addKey(Phaser.KeyCode.C);
      const vKey = game.input.keyboard.addKey(Phaser.KeyCode.V);
      const bKey = game.input.keyboard.addKey(Phaser.KeyCode.B);

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
    }
  }

  render() {
    GameManager.instance.update();
  }
}
