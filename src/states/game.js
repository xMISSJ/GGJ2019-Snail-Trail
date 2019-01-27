import { State, Phaser } from 'phaser';
import lang from '../lang';
import Background from '../sprites/background';
import Facebook from '../services/facebook';
import LocalizationManager from '../services/localizationManager';
import SignalManager from '../services/signalManager';
import Image from '../services/image';
import CollisionManager from '../sprites/collisionManager';
import Slug from '../sprites/slug';
import Shell from '../sprites/shell';
import ShellShine from '../sprites/shellShine';
import ColliderGroup from '../sprites/colliderGroup';
import GameManager from '../services/gameManager';
import CountDownText from '../sprites/countDownText';
import Leaderboard from '../sprites/ui/Leaderboard';
import Wall from '../sprites/wall';
import CharacterSelect from './characterSelect';
import Overlay from '../sprites/overlay';

export default class extends State {
  init() {
    this.game.input.maxPointers = 2;
    game.input.gamepad.start();
    game.world.setBounds(0, 0, 800, 800);
    game.physics.startSystem(Phaser.Physics.P2JS);
  }

  preload() {
    LocalizationManager.instance.loadLanguagePackage();
    this.game.load.json('characterSettings', 'assets/values/CharacterStats.json');
  }

  create() {
    this.background = new Background(0, 0);
    game.background = this.background;
    game.add.existing(this.background);

    if (__DEV__) {
      const rKey = game.input.keyboard.addKey(Phaser.KeyCode.R);

      rKey.onDown.add(() => {
        if (GameManager.instance.currentState === GameManager.instance.states.end) {
          game.state.start('characterSelect');
        }
      });
    }
    // this.collisionManager = new CollisionManager();
    this.buildWalls();
    this.buildShell();
    this.buildSlugs();
    this.leaderboard = new Leaderboard();

    GameManager.instance.startGame();

    this.overlay = new Overlay();
  }

  update() {
    if (GameManager.instance.currentState === GameManager.instance.states.game || GameManager.instance.currentState === GameManager.instance.states.end) {

      GameManager.instance.update();
      for (let i = 0; i < game.controllers.length; i++) {
        game.controllers[i].update();
      }
    }
  }

  buildWalls() {
    const wall1 = new Wall([0, 350], [720, 100]);
    game.add.existing(wall1);
    const wall2 = new Wall([1280, 350], [720, 100]);
    game.add.existing(wall2);
    const wall3 = new Wall([640, 0], [100, 1280]);
    game.add.existing(wall3);
    const wall4 = new Wall([640, 720], [100, 1280]);
    game.add.existing(wall4);
  }

  buildSlugs() {
    this.slugColors = [
      { tint: 0x69e037, color: 'green', name: 'bill' },
      { tint: 0xd71fa6, color: 'magenta', name: 'phteven' },
      { tint: 0xff8809, color: 'orange', name: 'carl' },
      { tint: 0x74b5ed, color: 'blue', name: 'frank' },
    ];

    game.slugColors = this.slugColors;

    this.slugPositions = [
      [200, 200],
      [1000, 200],
      [200, 500],
      [1000, 500],
    ];

    game.slugs = [];
    for (let i = 0; i < game.totalPlayers; i += 1) {
      const slug = new Slug(i + 1, this.slugPositions[i], this.slugColors[i]);
      game.playerSettings[i].controller.setCharacter(slug);
      game.add.existing(slug);
      game.slugs.push(slug);
    }
  }

  buildShell() {
    game.shellShine = new ShellShine();
    const shell = new Shell([game.width / 2, game.height / 2]);
    this.add.existing(game.shellShine);
    game.add.existing(shell);
    game.shellShine.onShellDrop(new Phaser.Point(shell.x, shell.y))
  }
}
