// /**
//  * List of all image data.
//  * Accepted key value pair are:
//  * { key: str*, dir: str, png: str*, etc1: str, s3tc: str, pvrtc: str, preload: bool }
//  * values with a star are required.
//  * @type {*[]}
//  */
// const imageList = [
//   { key: 'req', dir:'opt', png: 'req', etc1: 'opt', s3tc: 'opt', pvrtc: 'opt', preload: 'opt' },
//   { key: 'loaderBg', dir: '', png: 'loader-bg.png', preload: false },
//   { key: 'loaderBar', dir: '', png: 'loader-bar.png' },
// ];
//
// /**
//  * List of all sound data.
//  * Accepted key value pair are:
//  * { key: str*, dir: str, file: str*, preload: bool, allowMultiple: bool, loop: bool }
//  * @type {Array}
//  */
// const soundList = [
//   // { key: '', dir: '', file: ''},
// ];

import Singleton from './singleton';

/**
 * This class contains all data for loading assets. This way the boot.js stays clean.
 * Only this class needs to be adjusted for loading new assets.
 * Only the code above this description has to be adjusted per project.
 */
export default class AssetList extends Singleton {
  constructor() {
    super();

    this._imageList = [
      // TODO Add json key for texture atlasses.
      // { key: 'rq', dir: 'op', png: 'rq', etc1: 'op', s3tc: 'op', pvrtc: 'op', preload: 'op' },
      // Background
      { key: 'background', dir: '', png: 'bg.png' },
      { key: 'loaderBg', dir: '', png: 'loader-bg.png' },
      { key: 'selection', dir: '', png: 'selection-bg.png' },

      // User Interface
      { key: 'loaderBar', dir: '', png: 'loader-bar.png' },
      { key: 'menuCard', dir: '', png: 'placeholder.png' },

      // Snail
      { key: 'cloud', dir: '', png: 'cloud.png' },
      { key: 'snailhouse', dir: '', png: 'snailhouse.png' },
      { key: 'shellShine', dir: '', png: 'shine_shell.png' },
      { key: 'trailPart1', dir: 'trailParts/', png: 'patch01.png' },
      { key: 'trailPart2', dir: 'trailParts/', png: 'patch02.png' },
      { key: 'trailPart3', dir: 'trailParts/', png: 'patch03.png' },
      { key: 'trailPart4', dir: 'trailParts/', png: 'patch04.png' },

      { key: 'slugB', dir: '', png: 'icon-slug-blue.png' },
      { key: 'slugM', dir: '', png: 'icon-slug-magenta.png' },
      { key: 'slugO', dir: '', png: 'icon-slug-orange.png' },
      { key: 'slugG', dir: '', png: 'icon-slug-green.png' },

      { key: 'leaderboardCardBlue', dir: '', png: 'counter-blue.png' },
      { key: 'leaderboardCardOrange', dir: '', png: 'counter-orange.png' },
      { key: 'leaderboardCardMagenta', dir: '', png: 'counter-magenta.png' },
      { key: 'leaderboardCardGreen', dir: '', png: 'counter-green.png' },

      // Overlay
      { key: 'hype_bar', dir: 'overlay/', png: 'hype_bar.png' },
      { key: 'vs', dir: 'overlay/', png: 'vs.png' },
      { key: 'everyone_hype', dir: 'overlay/', png: 'everyone_hype.png' },
      { key: 'PHTEVEN', dir: 'overlay/', png: 'PHTEVEN.png' },
      { key: 'FRANK', dir: 'overlay/', png: 'FRANK.png' },
      { key: 'CARL', dir: 'overlay/', png: 'CARL.png' },
      { key: 'BILL', dir: 'overlay/', png: 'BILL.png' },
      { key: 'bill_buffed', dir: 'overlay/', png: 'bill_buffed.png' },
      { key: 'carl_buffed', dir: 'overlay/', png: 'carl_buffed.png' },
      { key: 'frank_buffed', dir: 'overlay/', png: 'frank_buffed.png' },
      { key: 'phteven_buffed', dir: 'overlay/', png: 'phteven_buffed.png' },
    ];

    this._soundList = [
      // { key: 'rq', dir: 'op', file: 'rq', preload: 'op'},
      { key: 'guitar', dir: '', file: 'guitar.wav' },
      { key: 'bass', dir: '', file: 'bass.wav' },
      { key: 'shaker', dir: '', file: 'shaker.wav' },
      { key: 'hihat1', dir: '', file: 'hihat1.wav' },
      { key: 'funkyMoog', dir: '', file: 'funkyMoog.wav' },
      { key: 'reageaDrums', dir: '', file: 'reageaDrums.wav' },
      { key: '85chiptune', dir: '', file: '85chiptune.wav' },
      { key: '85voiceSound', dir: '', file: '85voiceSound.wav' },
      { key: 'techLoop', dir: '', file: 'techLoop.wav' },

      { key: 'winner', dir: 'effects/', file: 'winner.wav'},
      { key: 'cheer', dir: 'effects/', file: 'cheer.wav'},
      { key: 'readySetGo', dir: 'effects/', file: 'readySetGo4.wav'},
      { key: 'swoosh', dir: 'effects/', file: 'swoosh.wav'},
      { key: 'smallCrack', dir: 'effects/', file: 'smallCrack.wav'},
      { key: 'slimeBoost', dir: 'effects/', file: 'slimeBoost.wav'},
      { key: 'yayBill', dir: 'effects/', file: 'yay-bill.wav' },
      { key: 'yayCarl', dir: 'effects/', file: 'yay-carl.ogg' },
      { key: 'yayFrank', dir: 'effects/', file: 'yay-frank.wav' },
      { key: 'yayPhteven', dir: 'effects/', file: 'yay-phteven.wav' }
    ];

    this._soundPath = './assets/sounds/';
    this._imagePath = './assets/images/';
    this._compressionList = ['etc1', 's3tc', 'pvrtc'];
  }

  /**
   * Get the list of all image data.
   * @returns {array} Array of all images.
   */
  get images() {
    return this._imageList;
  }

  /**
   * Get the list of all sound data.
   * @returns {array} Array of all sounds.
   */
  get sounds() {
    return this._soundList;
  }

  /**
   * Return the path where all images are.
   * @returns {string}
   */
  get imagePath() {
    return this._imagePath;
  }

  /**
   * Return the path where all sounds are.
   * @returns {string}
   */
  get soundPath() {
    return this._soundPath;
  }

  /**
   * Return list of all compression.
   * @returns {string[]}
   */
  get compression() {
    return this._compressionList;
  }
}
