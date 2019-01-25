import Phaser from 'phaser';
import Singleton from './singleton';

export default class SoundManager extends Singleton {
  constructor() {
    super();

    this._soundList = [];
  }

  addSound(key, loop = false, allowMultiple = false) {
    const sound = new Phaser.Sound(game, key, 1, loop);
    sound.allowMultiple = allowMultiple;
    this._soundList.push(sound);
  }

  getSound(key) {
    if (!this._soundList) {
      return null;
    }

    return this._soundList.find(x => x.key === key);
  }

  playSound(key) {
    this.getSound(key).play();
  }
}
