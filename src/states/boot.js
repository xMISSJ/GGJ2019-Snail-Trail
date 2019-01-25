import { State } from 'phaser';
import Facebook from '../services/facebook';
import AssetList from '../services/assetList';
import SoundManager from '../services/soundManager';

// Private methods.
const loadImage = Symbol('loadImage');
const loadSound = Symbol('loadSound');
const setTexturePriority = Symbol('setTexturePriority');
const fileComplete = Symbol('fileComplete');
const loadComplete = Symbol('loadComplete');
const startCreateGame = Symbol('startCreateGame');

export default class extends State {
  init() {
    game.stage.disableVisibilityChange = false;

    this._compression = AssetList.instance.compression;
    this._soundPath = AssetList.instance.soundPath;
    this._imagePath = AssetList.instance.imagePath;

    this._imageList = AssetList.instance.images;
    this._soundList = AssetList.instance.sounds;
  }

  preload() {
    // Load all images
    for (let i = 0; i < this._imageList.length; i += 1) {
      this[loadImage](this._imageList[i]);
    }

    // Load all sounds
    for (let i = 0; i < this._soundList.length; i += 1) {
      this[loadSound](this._soundList[i]);
    }

    this.loadSpritesheets();

    this.load.onFileComplete.add(this[fileComplete], this);
    this.load.onLoadComplete.add(this[loadComplete], this);
  }

  loadSpritesheets() {
    // Parameters(key, path, width, height, amount of frames
    // game.load.spritesheet('ms', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

    game.load.spritesheet('slug', 'assets/sprites/slug-move-spritesheet.png', 33, 74, 4);
  }

  [loadComplete]() {
    this.load.onFileComplete.removeAll();
    this.load.onLoadComplete.removeAll();

    this[startCreateGame]();
  }

  // eslint-disable-next-line
  [fileComplete](progress) {
    Facebook.instance.setLoadingProgress(progress);
  }

  /**
   * This method will automatically load all images with the correct settings and compression.
   *
   * @param image An image object containing all data. Accepted data keys are key, png, dir
   * and the image compression methods. The first three are required, the others are optional.
   */
  [loadImage](image) {
    // TODO also load texture atlas.
    if (image.preload !== undefined && !image.preload) {
      return;
    }

    const data = { truecolor: this._imagePath + image.dir + image.png };

    for (let i = 0; i < this._compression.length; i += 1) {
      if (image[this._compression[i]]) {
        data[this._compression[i]] = this._imagePath + image.dir + image[this._compression[i]];
      }
    }
    this.load.image(image.key, data);
  }

  /**
   * Loads all sound files in the soundList. It accepts three keys: key, dir and file
   */
  [loadSound](sound) {
    if (sound.preload !== undefined && !sound.preload) {
      return;
    }

    this.load.audio(sound.key, this._soundPath + sound.dir + sound.file);
    SoundManager.instance.addSound(sound.key, sound.loop, sound.allowMultiple);
  }

  /**
   * Set the final settings and create the state Game.
   */
  [startCreateGame]() {
    this[setTexturePriority]();
    this.game.clearBeforeRender = false;
    const sounds = [];
    for (let i = 0; i < this._soundList.length; i += 1) {
      sounds.push(this._soundList[i]);
    }

    game.sound.setDecodedCallback(sounds, () => {
      Facebook.instance.startGameAsync(() => {
        window.game.state.start('Game', true, false);
      }, this);
    }, this);
  }

  /**
   * All images will be added to the TexturePriority. This will lower the drawcalls. The keys in
   * the imageList will be used.
   */
  [setTexturePriority]() {
    const textures = ['_default'];
    for (let i = 0; i < this._imageList.length; i += 1) {
      textures.push(this._imageList[i]);
    }

    this.game.renderer.setTexturePriority(textures);
  }
}
