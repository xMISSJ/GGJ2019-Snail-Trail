import Singleton from "./singleton";
import SoundManager from "./soundManager";

export default class SoundEffects extends Singleton {
  constructor() {
    super();
    this.smallCrack = SoundManager.instance.getSound('smallCrack');
    this.slimeBoost = SoundManager.instance.getSound('slimeBoost');
  }

  onShellHit() {
    this.smallCrack.play('', 0,1);
  }

  onBoost() {
    this.slimeBoost.play('', 0,1);
  }
}