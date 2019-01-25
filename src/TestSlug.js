import Phaser from 'phaser';
import Controller from './services/Controller';

export default class character extends Phaser.Sprite {
    constructor ({ playerNumber }) {
        super(game, 200, 200,'loaderBar');
    }
}