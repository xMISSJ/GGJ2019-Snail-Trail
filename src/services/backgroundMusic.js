import Singleton from './singleton';
import SoundManager from './soundManager';
import GameManager from './gameManager';

export default class BackgroundMusic extends Singleton {
  constructor() {
    super();
    this.loops = [];
    this.guitar = SoundManager.instance.getSound('guitar');
    this.bass = SoundManager.instance.getSound('bass');
    this.shaker = SoundManager.instance.getSound('shaker');
    this.hihat = SoundManager.instance.getSound('hihat1');
    this.funkyMoog = SoundManager.instance.getSound('funkyMoog');
    this.reageaDrums = SoundManager.instance.getSound('reageaDrums');
    //this.loops.push(this.guitar);
    //this.loops.push(this.bass);
    this.loops.push(this.shaker);
    this.loops.push(this.hihat);
    this.loops.push(this.funkyMoog);
    this.loops.push(this.reageaDrums);
    this.playOrder = [
      this.hihat,
      this.shaker,
      this.reageaDrums,
      this.funkyMoog,
      this.guitar,
      this.bass
    ];
    for (let i = 0; i < this.loops.length; i++) {
      this.loops[i].play('', i, 0, true);
      this.loops[i]._sound.playbackRate.value = 1;
    };
    console.log(this.guitar);

    this.currentToPlay = 0;

    this.speedMin = 1;
    this.speedMax = 1.4;
    this.currentSpeed = this.speedMin;
    this.speedChange = 0.0075;
    this.targetSpeed = this.speedMin;
    this.setIngameSound();
  }

  update() {
    if (GameManager.instance.currentState === GameManager.instance.states.game) {
      var currentMaxValue = GameManager.instance.playerScores[GameManager.instance.shellHolder - 1];
      console.log(currentMaxValue);
      currentMaxValue = isNaN(currentMaxValue) ? 0 : currentMaxValue;
      var speedDif = this.speedMax - this.speedMin;
      var ratio = currentMaxValue / GameManager.instance.winAmount;
      var extraValue = speedDif * ratio;
      var newVal = this.speedMin + extraValue;
      this.targetSpeed = newVal;
    } else {
      this.targetSpeed = this.speedMin;
    }
    var nextStep = this.speedChange;
    nextStep = this.currentSpeed > this.targetSpeed ? - nextStep : nextStep;
    this.currentSpeed += nextStep;

    this.techLoop._sound.playbackRate.value = this.currentSpeed;
  }
  setIngameSound() {
    this.techLoop = SoundManager.instance.getSound('techLoop')
    this.voiceSound = SoundManager.instance.getSound('85voiceSound');

    this.techLoop.play('',0,0, true);
  }

  playRandomVoice() {
    console.log('play voice');
    this.voiceSound.volume = 1;
    game.time.events.add(2000, () => {
      this.voiceSound.volume = 0;
    }, this);
  }

  playNextSound() {
    console.log("next sound");
    this.playOrder[this.currentToPlay++].volume = 1;
    for (let i = 0; i < this.loops.length; i++) {
      this.loops[i]._sound.playbackRate.value += 0.05;
    };
  }

  playInGameSound() {
    this.techLoop.volume = 1;
    this.voiceSound.play('',0,0, true);
  }

  stopCharacterSelect() {
    for (let i = 0; i < this.loops.length; i++) {
      this.loops[i].stop();
    };
  }

}