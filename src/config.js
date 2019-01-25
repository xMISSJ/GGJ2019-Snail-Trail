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
  },
};
