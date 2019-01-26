import Singleton from "./singleton";
import SoundManager from "./soundManager";

export default class SoundEffects extends Singleton {
  constructor() {
    super();
    this.smallCrack = SoundManager.instance.getSound('smallCrack');
  }

  onShellHit() {
    this.smallCrack.play('', 0,1);
  }
}