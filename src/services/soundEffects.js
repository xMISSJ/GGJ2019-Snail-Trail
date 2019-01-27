import Singleton from "./singleton";
import SoundManager from "./soundManager";

export default class SoundEffects extends Singleton {
  constructor() {
    super();
    this.smallCrack = SoundManager.instance.getSound('smallCrack');
    this.slimeBoost = SoundManager.instance.getSound('slimeBoost');
    this.swoosh = SoundManager.instance.getSound('swoosh');
    this.readySetGo = SoundManager.instance.getSound('readySetGo')
    this.winner = SoundManager.instance.getSound('winner');
    this.cheer = SoundManager.instance.getSound('cheer');

    this.yaySounds = {
      bill: SoundManager.instance.getSound('yayBill'),
      carl: SoundManager.instance.getSound('yayCarl'),
      frank: SoundManager.instance.getSound('yayFrank'),
      phteven: SoundManager.instance.getSound('yayPhteven')
    };
  }

  onShellHit() {
    this.smallCrack.play('', 0,1);
  }

  onBoost() {
    this.slimeBoost.play('', 0,1);
  }

  setYayName(name) {
    this.yayName = name;
  }
  onYay() {
    this.yaySounds[this.yayName].play('', 0, 1);
  };

  onSwoosh() {
    this.swoosh.play('', 0.1, 1);
  }

  onReadySetGo() {
    this.readySetGo.play('', 0.1, 1);
  }

  onWinner() {
    this.winner.play('', 0.1, 1);
    this.cheer.play('',1,1);
  }
}