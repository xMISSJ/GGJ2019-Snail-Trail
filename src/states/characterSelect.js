import { State, Phaser } from 'phaser';
import SignalManager from '../services/signalManager';

export default class characterSelect extends State {
  init() {
    console.log('characterSelect state is loaded.');
    //console.log(slug.gamePad);

    // Characters defined in assetList with keys.
    this.characterArray = ['snail1', 'snail2', 'snail3', 'snail4'];

    game.state.start('game');
  }

  create() {

  }
}
