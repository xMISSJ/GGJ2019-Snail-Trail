import { State, Phaser } from 'phaser';
import PlayerMapping from '../services/PlayerMapping';
import BackgroundMusic from '../services/backgroundMusic';
import Controller from '../services/Controller';
import Config from '../config';
import Text from '../services/text';
import SoundEffects from '../services/soundEffects';

export default class characterSelect extends State {
  init() {
    console.log('characterSelect state is loaded.');
    // console.log(slug.gamePad);

    game.playerMap = new PlayerMapping();
    this.buttonInput = [];
    this.pads = [];
    game.controllers = [];
    this.controllersAdded = [false, false, false, false];
    this.screens = [1, 2, 3, 4];

    this.spriteNames = ['slugG', 'slugM', 'slugO', 'slugB'];
    this.slugNames = ['Bill', 'Phteven', 'Carl', 'Frank'];
    this.offset = 295;

    game.backgroundMusic = new BackgroundMusic();
  }

  create() {
    game.stage.backgroundColor = '#2d2d2d';

    game.input.gamepad.start();

    for (let i = 1; i < 5; i++) {
      this.pads.push(game.input.gamepad[`pad${i}`]);
      const settings = Config.playerInput[`player${i}`];
      game.controllers.push(new Controller(game, null, game.input.gamepad[`pad${i}`], settings));
    }

    this.background = game.add.sprite(0, 0, 'selection');
    this.background.scale.setTo(4);

    this.topBackground = game.add.sprite(0, 0, 'topTriangles');
    this.topBackground.animations.add('movement', [0, 1, 2, 3], 10, true);

    if (this.topBackground) {
      this.topBackground.animations.play('movement');
      this.topBackground.scale.set(4);
    }

    this.startText = new Text({ text: 'Press B to start the game!', position: new Phaser.Point(game.width / 2, game.height - 67), fontSize: 20, color: '#FFFFFF' });
    this.startText.visible = false;
    this.add.existing(this.startText);
    game.add.tween(this.startText).to({ y: this.startText.y - 4 }, 100, 'Linear', true).yoyo(true).loop(true);
  }

  update() {
    for (let i = 0; i < game.controllers.length; i++) {
      game.controllers[i].update();
      if (game.controllers[i].buttonInput.start || game.controllers[i].buttonInput.b) {
        if (this.controllersAdded[i]) {
          game.state.start('Game');
          BackgroundMusic.instance.stopCharacterSelect();
        }
      }
      if (this.controllersAdded[i]) continue;
      for (const buttonPress in game.controllers[i].buttonInput) {
        if (game.controllers[i].buttonInput[buttonPress]) {
          this.controllersAdded[i] = true;

          this.addPlayer(game.controllers[i]);
          // console.log('adding controller: ', i + 1);
          // console.log(game.totalPlayers - 1);
          BackgroundMusic.instance.playNextSound();
          this.createCard(game.totalPlayers - 1);
          this.screens.push(this.screen);
          this.screen.scale.set(4);
          this.add.existing(this.nameText);
          SoundEffects.instance.setYayName(this.nameText.text.toLowerCase());
          SoundEffects.instance.onYay();
        }
        break;
      }
    }
  }

  addPlayer(controller) {
    game.playerMap.addPlayer(controller);
    if (!this.startText.visible && this.controllersAdded.reduce((x, y) => x + y) >= 2) {
      this.startText.visible = true;
    }
  }

  createCard(index) {
    this.screen = game.add.sprite(93 + index * this.offset, 235, this.spriteNames[index]);
    this.nameText = new Text({ text: this.slugNames[index], position: new Phaser.Point(190 + index * this.offset, this.screen.y - 70), fontSize: 20, color: '#FFFFFF' });
    game.add.tween(this.nameText.scale).to({ x: 1.1, y: 1.1 }, 200, 'Linear', true);
  }
}
