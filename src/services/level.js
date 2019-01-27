import Box from '../sprites/box';
import Singleton from './singleton';

export default class GameManager extends Singleton {
  constructor() {
    super();

    this.totalLevels = 5;
    this.wallBoundsOffset = 120;
    var randomRatio = Math.random();
    var rndLevel = (Math.floor(randomRatio * this.totalLevels) + 1);
    console.log('randomRatio', randomRatio);
    console.log('rndLevel', rndLevel);
    switch (rndLevel) {
      case 1:
        this.createLevel1();
        break;
      case 2:
        this.createLevel2();
        break;
      case 3:
        this.createLevel3();
        break;
      case 4:
        this.createLevel4();
        break;
      case 5:
        this.createLevel5();
        break;
    }
  }

  createLevel1() {
    this.newBox = new Box(game.width / 2, this.wallBoundsOffset);
    this.newBox2 = new Box(game.width / 2, game.height - this.wallBoundsOffset);
    game.add.existing(this.newBox);
    game.add.existing(this.newBox2);
  }

  createLevel2() {
    this.newBox = new Box(this.wallBoundsOffset, game.height / 2 );
    this.newBox2 = new Box(game.width - this.wallBoundsOffset, game.height / 2 );
    game.add.existing(this.newBox);
    game.add.existing(this.newBox2);
  }

  createLevel3() {
    this.newBox = new Box(this.wallBoundsOffset, this.wallBoundsOffset);
    this.newBox2 = new Box(game.width - 100, game.height - this.wallBoundsOffset);
    game.add.existing(this.newBox);
    game.add.existing(this.newBox2);
  }

  createLevel4() {
    this.newBox = new Box(game.width/2, this.wallBoundsOffset * 2);
    this.newBox2 = new Box(game.width/2, game.height - this.wallBoundsOffset*2);
    game.add.existing(this.newBox);
    game.add.existing(this.newBox2);
  }

  createLevel5() {
    this.newBox = new Box(this.wallBoundsOffset * 3, game.height/2);
    this.newBox2 = new Box(game.width - this.wallBoundsOffset * 3, game.height/2);
    game.add.existing(this.newBox);
    game.add.existing(this.newBox2);
  }
}
