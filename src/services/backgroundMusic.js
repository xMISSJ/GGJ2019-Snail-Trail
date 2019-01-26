import Singleton from './singleton';
import SoundManager from './soundManager'
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

    this.setIngameSound();
  }

  setIngameSound() {
    this.techLoop = SoundManager.instance.getSound('techLoop')
    this.voiceSound = SoundManager.instance.getSound('85voiceSound');
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
    this.techLoop.play('',0,1, true);
    this.voiceSound.play('',0,0, true);
  }

  stopCharacterSelect() {
    for (let i = 0; i < this.loops.length; i++) {
      this.loops[i].stop();
    };
  }

}