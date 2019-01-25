import Phaser from 'phaser';

export default {
  width: 1280,
  height: 720,
  parent: 'gameWrapper',
  scaleMode: Phaser.ScaleManager.EXACT_FIT,
  renderer: Phaser.CANVAS,
  fullScreenScaleMode: Phaser.ScaleManager.NO_SCALE,
  transparent: false,
  antialias: false,
  multiTexture: true,
  enableDebug: __DEV__,

  playerInput: {
    player1: {
      keys: {
        up: 'W', down: 'S', left: 'A', right: 'D', attack: 'Q',
      },
    },
    player2: {
      keys: {
        up: 'I', down: 'K', left: 'J', right: 'L', attack: 'P',
      },
    },
    player3: {
      keys: {
        up: '1', down: '2', left: '3', right: '4', attack: '5',
      },
    },
    player4: {
      keys: {
        up: '6', down: '7', left: '8', right: '9', attack: '0',
      },
    },
  },
};
