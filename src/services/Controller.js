import Phaser from 'phaser';

export default class Controller {
  constructor(pGame, pCharacter, pGamePad, playerSettings) {
    this.game = pGame;
    this.character = pCharacter;
    this.inputPad = pGamePad;
    this.configSettings = playerSettings;
    this.keys = {
      up: game.input.keyboard.addKey(Phaser.Keyboard[this.configSettings.keys.up]),
      down: game.input.keyboard.addKey(Phaser.Keyboard[this.configSettings.keys.down]),
      left: game.input.keyboard.addKey(Phaser.Keyboard[this.configSettings.keys.left]),
      right: game.input.keyboard.addKey(Phaser.Keyboard[this.configSettings.keys.right]),
      attack: game.input.keyboard.addKey(Phaser.Keyboard[this.configSettings.keys.attack]),
    };

    this.onLeftRelease = new Phaser.Signal();
    this.onRightRelease = new Phaser.Signal();
    this.onUpRelease = new Phaser.Signal();
    this.onDownRelease = new Phaser.Signal();
    this.onShootRelease = new Phaser.Signal();

    this.wasHolding = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };

    this.inputPad.deadZone = 0.005;
    this.minimalMove = 0.6;
  }

  update() {
    this.buttonInput = {
      a: (this.inputPad.isDown(Phaser.Gamepad.XBOX360_A)),
      b: (this.inputPad.isDown(Phaser.Gamepad.XBOX360_B)),
      y: (this.inputPad.isDown(Phaser.Gamepad.XBOX360_Y)),
      x: (this.inputPad.isDown(Phaser.Gamepad.XBOX360_X))
    };

    this.input = {
      left: (this.keys.left.isDown && !this.keys.right.isDown)
                || (this.inputPad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) && !this.inputPad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT))
                || this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.5,
      right: (this.keys.right.isDown && !this.keys.left.isDown)
                || (this.inputPad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) && !this.inputPad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT))
                || this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.5,
      up: this.keys.up.isDown
                || this.inputPad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
                || this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.8
                || this.inputPad.isDown(Phaser.Gamepad.XBOX360_A),
      down: this.keys.down.isDown
                || this.inputPad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
                || this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.7,
      shoot: this.keys.attack.isDown
                || this.inputPad.justPressed(Phaser.Gamepad.XBOX360_LEFT_TRIGGER)
                || this.inputPad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER),
      aimLeft: this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.005,
      aimRight: this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.005,
      aimUp: this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) < -0.005,
      aimDown: this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y) > 0.005,
    };

    if(!this.character) return;

    var stickPoint = new Phaser.Point(this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X),
      this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
    if (stickPoint.getMagnitude() > this.minimalMove) {
      this.character.targetDirection.x = stickPoint.x;
      this.character.targetDirection.y = stickPoint.y;
    } else {
      this.character.targetDirection.x = 0;
      this.character.targetDirection.y = 0;
    }

    if (this.input.left) {
      if (this.wasHolding.right) {
        this.wasHolding.right = false;
        this.onRightRelease.dispatch();
      }
      this.wasHolding.left = true;
      this.character.moveLeft();
    } else if (this.input.right) {
      if (this.wasHolding.left) {
        this.wasHolding.left = false;
        this.onLeftRelease.dispatch();
      }
      this.wasHolding.right = true;
      this.character.moveRight();
    } else if (this.character.isOnGround) {
      if (this.wasHolding.left) {
        this.wasHolding.left = false;
        this.onLeftRelease.dispatch();
      }
      if (this.wasHolding.right) {
        this.wasHolding.right = false;
        this.onRightRelease.dispatch();
      }
    }
    if (this.input.up) {
      this.character.moveUp();
    } else if (this.input.down) {
      this.character.moveDown();
    }

    this.tempAimDirection = { x: 0, y: 0 };
    if (this.input.aimLeft || this.input.aimRight) {
      this.tempAimDirection.x = this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
    }

    if (this.input.aimUp || this.input.aimDown) {
      this.tempAimDirection.y = this.inputPad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);
    }

    const aimDirLenght = Math.sqrt(Math.pow(this.tempAimDirection.x, 2) + Math.pow(this.tempAimDirection.y, 2));
    if (aimDirLenght > this.minimalAim) {
      this.character.aimDirection = this.tempAimDirection;
    }

    if (this.input.shoot) {
      this.character.shoot();
      this.wasHolding.shoot = true;
    } else if (this.wasHolding.shoot) {
      this.wasHolding.shoot = false;
      this.onShootRelease.dispatch();
    }

    if (this.buttonInput.a) {
      this.character.pressA();
    }
  }

  checkOnRelease() {

  }

  setCharacter(character) {
    this.character = character;
    console.log(this.character);
  }
}
