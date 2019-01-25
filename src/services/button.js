import Phaser from 'phaser';
import Default from './default';
import SoundManager from './soundManager';
/*
 Button Class

 A clickable sprite which changes texture when on click.
 It has a three states: default, down and disable.
 IMPORTANT: Override the method doOnClick!
 Override the method doOnClickDisabled if you make use of the disable state.
*/

export default class Button extends Phaser.Image {
  constructor({
    key, sfx = Default.buttonClickSFX, x, y, frame, frameDisable = frame, frameDown = frame,
    disabled = false, anchor = [0.5], scale = [1],
  }) {
    super(game, x, y, key, frame);

    this.textureList = { default: frame, down: frameDown, disable: frameDisable };
    this.state = { default: 1, down: 2, disable: 3 };
    Object.freeze(this.state);

    this.currentState = this.state.default;

    if (disabled) {
      this.doDisable();
    }

    this.sfx = sfx;

    this.anchor.setTo(anchor[0], anchor[1] || anchor[0]);
    this.scale.setTo(scale[0], scale[1] || scale[0]);

    this.inputEnabled = true;

    this.events.onInputUp.add(() => {
      this.changeState('default');
      SoundManager.instance.play(this.sfx);
      this.checkIfClickAble();
    });

    this.events.onInputDown.add(() => {
      this.changeState('down');
      // this.sfx.play();
    });
  }

  doDisable() {
    this.changeState('disable');
  }

  doEnable() {
    this.currentState = this.state.default;
    this.changeTexture(this.textureList.default);
  }

  changeState(state) {
    if (this.currentState === this.state.disable) {
      return;
    }

    switch (state) {
      case 'default':
        this.currentState = this.state.default;
        this.changeTexture(this.textureList.default);
        break;
      case 'down':
        this.currentState = this.state.down;
        this.changeTexture(this.textureList.down);
        break;
      case 'disable':
        this.currentState = this.state.disable;
        this.changeTexture(this.textureList.disable);
        break;
      default:
        this.currentState = this.state.default;
        this.changeTexture(this.textureList.default);
        break;
    }
  }

  changeTexture(key = this.textureList.default) {
    // this.loadTexture(key);
    if (key === undefined) {
      return;
    }
    this.frameName = key;
  }

  // Empty shell. Override this methode
  doOnClick() {
    // console.warn('doOnClick is empty!');
  }

  // Empty shell. Override this methode
  doOnClickDisabled() {
    console.warn('doOnClickDisabled is empty!');
  }

  checkIfClickAble() {
    if (this.currentState !== this.state.disable) {
      this.doOnClick();
      return;
    }

    this.doOnClickDisabled();
  }
}
