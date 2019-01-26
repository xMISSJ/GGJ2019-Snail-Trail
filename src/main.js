import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Facebook from './services/facebook';

import BootState from './states/boot';
import GameState from './states/game';

import config from './config';

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.state.add('Boot', BootState, false);
    this.state.add('Game', GameState, false);
    this.state.add('characterSelect', GameState, false);

    this.state.start('Boot');
  }
}

Facebook.instance.initializeGame(Game);
