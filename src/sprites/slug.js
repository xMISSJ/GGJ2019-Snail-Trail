import { Phaser, Point } from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';
import SignalManager from '../services/signalManager';
import GameManager from '../services/gameManager';
import TrailPart from './trailPart'

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({ asset: 'slug', x: position[0], y: position[1] });

    this.states = { SLUG: 0, SNAIL: 1 };
    Object.freeze(this.state);
    this.tag = "slug";
    this.maxHP = 3;

    this.switchState(this.states.SLUG);
    this.currentHP = this.maxHP;

    this.shell = null;

    this.collidingWith = [];

    this.playerNumber = playerNumber;

    game.physics.p2.enable(this, true);
    this.body.enable = true;
    this.body.clearShapes();
    this.body.addCapsule(40, 20, 10, 0, 0);
    this.body.fixedRotation = true
    this.body.angle = 90
    this.body.collideWorldBounds = true;

    this.scale.set(1, 1);
    this.settings = Config.playerInput[`player${playerNumber}`];
    this.gamePad = this.game.input.gamepad[`pad${playerNumber}`];
    this.controller = new Controller(game, this, this.gamePad, this.settings);

    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point(0, 0);
    this.lastDirection = new Point(1, 0);

    this.rotationSpeed = 1.5;
    this.currentMovementSpeed = 0;
    this.movementSpeedStep = 0.05;
    this.maxMovementSpeed = 3;
    this.body.debug = true
    this.boostSpeed = 5;
    this.speedDecrease = 0.12;

    this.isMoving = false;

    this.canBoost = true;
    this.isBoosting = false;
    this.createSlug();
    this.body.onBeginContact.add(this.onContact, this)

    this.trailParts = [];
    this.maxTrailParts = 75;
    for (let i = 0; i < this.maxTrailParts; i += 1) {
      var trailPart = new TrailPart(10,50)
      this.trailParts.push(trailPart);
      game.add.existing(trailPart);
    }
    this.trailCooldown = 0.05;
    this.trailCurrentTime = 0;
    this.trailToSpawn = 0;
  }

  createSlug() {
    this.smoothed = false;
    SignalManager.instance.dispatch('addSlug', this);
    this.moving = this.animations.add('moving', [0, 1, 2, 3], 10, true);
    this.movingSnail = this.animations.add('movingSnail', [0, 1, 2, 3], 10, true);
    // this.idle = this.player.animations.add('idle', [0,3], 10, true);
  }

  onContact(body) {
    switch(body.sprite.tag) {
      case 'slug':
        this.onCollideSlug(this, body.sprite);
        break;
      case 'shell':
        this.onCollideShell(this, body.sprite);
        break;
    }
  }

  onCollideSlug(entity1, entity2) {
    this.removeHealth(entity1, entity2, 1);
  }

  checkIfNotColliding(entity) {
    const index = this.collidingWith.indexOf(entity);

    if (index >= 0) {
      this.collidingWith.splice(index, 1);
    }
  }

  setVelocity(entity1, entity2, magnitude) {
    return;
    const point = new Point();
    const difference = Point.subtract(entity1.position, entity2.position, point).normalize();
    this.body.velocity.setTo(this.body.velocity.x + difference.x * magnitude, this.body.velocity.y + difference.y * magnitude);
  }

  onCollideShell(entity1, entity2) {
    if (!entity2.isPickable) return;
    entity2.onCollide();
    this.switchState(this.states.SNAIL);
    GameManager.instance.pickUpShell(this.playerNumber);

    this.shell = entity2;
  }

  removeHealth(entity1, entity2, value) {
    if (!this.isSnail) return;

    this.currentHP -= value;

    if (this.currentHP <= 0) {
      this.switchState(this.states.SLUG);
      GameManager.instance.dropShell();

      this.setVelocity(entity1, entity2, 500);
      if (this.shell) {
        this.shell.onSpawn(this.position);
        this.shell = null;
      }
    }
  }

  update() {
    this.controller.update();
    this.currentDirection.normalize();

    if (this.targetDirection.getMagnitude() > 0.2) {
      if (this.currentDirection.getMagnitude() < 0.2) {
        console.log('lastDirection', this.lastDirection);
        this.isMoving = true;
        this.currentDirection.x = this.lastDirection.x;
        this.currentDirection.y = this.lastDirection.y;
        this.currentDirection.normalize();
      }

      this.rotate();
      this.currentMovementSpeed += this.movementSpeedStep;
    } else if (this.currentDirection.getMagnitude() > 0.2) {
      this.currentMovementSpeed -= this.movementSpeedStep * 3;
      this.lastDirection.x = this.currentDirection.x;
      this.lastDirection.y = this.currentDirection.y;
    } else if (this.isMoving) {
      this.isMoving = false;
      this.currentMovementSpeed = 0;
    }

    if (this.isBoosting) {
      this.currentMovementSpeed -= this.speedDecrease;
      if (this.currentMovementSpeed < this.maxMovementSpeed) {
        this.currentMovementSpeed = this.maxMovementSpeed;
        this.isBoosting = false;
        this.canBoost = true;
        // TODO Start cooldown
      }
    } else {
      this.currentMovementSpeed = Phaser.Math.clamp(this.currentMovementSpeed, 0, this.maxMovementSpeed);
    }
    this.currentDirection.multiply(this.currentMovementSpeed, this.currentMovementSpeed);

    this.x += this.currentDirection.x;
    this.y += this.currentDirection.y;
    this.body.moveRight(this.currentDirection.x * 60);
    this.body.moveDown(this.currentDirection.y * 60);
    this.doAnimation();
    this.handleTrailSpawn();
  }

  rotate() {
    if (this.targetDirection.x * this.currentDirection.y > this.targetDirection.y * this.currentDirection.x) {
      this.currentDirection.rotate(0, 0, -this.rotationSpeed, true);
    } else {
      this.currentDirection.rotate(0, 0, this.rotationSpeed, true);
    }

    const newAngle = this.currentDirection.angle(new Point(0, 0), true) + 180;
    this.angle = newAngle + 90;
    this.body.angle = this.angle - 90;
  }

  doAnimation() {
    if (this.isMoving) {
      if(this.states.SLUG) this.play('moving');
      else if(this.states.SNAIL) this.play('movingSnail');

    } else {
      // TODO Play idle
    }
  }

  moveUp() {

  }

  moveDown() {

  }

  moveLeft() {

  }

  moveRight() {

  }

  /* -----------------------------
   * States management
   ----------------------------- */

  switchState(state) {
    this.currentState = state;

    switch (this.currentState) {
      case this.states.SLUG:
        this.switchToSlug();
        break;
      case this.states.SNAIL:
        this.switchToSnail();
        break;
      default: console.warn('Something is wrong with ', this.currentState);
    }
  }

  get isSlug() {
    return this.currentState === this.states.SLUG;
  }

  get isSnail() {
    return this.currentState === this.states.SNAIL;
  }

  switchToSlug() {
    // TODO for testing purposes
    this.tint = 0xffffff;
    this.currentHP = 3;
    this.maxMovementSpeed -= 1;
    this.loadTexture('slug');
  }

  switchToSnail() {
    // TODO for testing purposes
    this.tint = Math.random() * 0xffffff;
    this.maxMovementSpeed += 1;
    this.loadTexture('snail');
  }

  shoot() {
    if (this.canBoost) {
      this.canBoost = false;
      this.isBoosting = true;
      this.currentMovementSpeed += this.boostSpeed;
    }
  }

  handleTrailSpawn() {
    for (let i = 0; i < this.maxTrailParts; i += 1) {
      this.trailParts[i].update();
    }
    this.trailCurrentTime -= game.time.elapsed/1000;

    if(!this.isMoving) return;
    if (this.trailCurrentTime < 0) {
      this.trailCurrentTime = this.trailCooldown;
      this.trailParts[this.trailToSpawn].spawnPart(this.x, this.y, this.angle);
      this.trailToSpawn++;
      if(this.trailToSpawn >= this.maxTrailParts - 1) this.trailToSpawn = 0;
    }
  }
}
