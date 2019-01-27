import { State } from 'phaser';

export default class Splash extends State {
  init() {
    game.stage.backgroundColor = '#ffffff';
    this.logoTeam = this.game.add.image(game.width / 2, game.height / 2, 'logo-team');
    this.logoTeam.anchor.setTo(0.5, 0.5);
    this.logoTeam.alpha = 0;

    this.logoGame = this.game.add.image(game.width / 2, game.height / 2, 'logo');
    this.logoGame.anchor.setTo(0.5, 0.5);
    this.logoGame.alpha = 0;
  }

  create() {
    this.tweenInTeam = game.make.tween(this.logoTeam).to({ alpha: 1 }, 1000, null, true, 500);
    this.tweenOutTeam = game.make.tween(this.logoTeam).to({ alpha: 0 }, 1000, null, false, 2000);

    this.tweenInGame = game.make.tween(this.logoGame).to({ alpha: 1 }, 1000, null, false);
    this.tweenOutGame = game.make.tween(this.logoGame).to({ alpha: 0 }, 1000, null, false, 2000);

    this.tweenInTeam.chain(this.tweenOutTeam);
    this.tweenOutTeam.chain(this.tweenInGame);
    this.tweenInGame.chain(this.tweenOutGame);
    this.tweenOutGame.onComplete.add(this.startGame, this);
  }

  startGame() {
    window.game.state.start('characterSelect');
  }
}
