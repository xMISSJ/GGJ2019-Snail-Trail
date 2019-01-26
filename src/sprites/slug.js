import { Phaser, Point } from 'phaser';
import Sprite from '../services/sprite';
import Controller from '../services/Controller';
import Config from '../config';
import SignalManager from '../services/signalManager';
import GameManager from '../services/gameManager';
import TrailPart from './trailPart';

export default class Slug extends Sprite {
  constructor(playerNumber, position) {
    super({ asset: 'slug', x: position[0], y: position[1] });

    this.states = { SLUG: 0, SNAIL: 1 };
    Object.freeze(this.state);
    this.tag = 'slug';
    this.maxHP = 3;

    this.switchState(this.states.SLUG);
    this.characterStats = this.game.cache.getJSON('characterSettings');
    this.currentStats = this.characterStats[Object.keys(this.states)[this.currentState]];
    this.currentHP = this.maxHP;

    this.shell = null;

    this.collidingWith = [];

    this.playerNumber = playerNumber;

    game.physics.p2.enable(this, true);
    this.body.enable = true;
    this.body.clearShapes();
    this.body.addCapsule(40, 20, 10, 0, 0);
    this.body.fixedRotation = true;
    this.body.angle = 90;
    this.body.collideWorldBounds = true;

    this.scale.set(1, 1);
    this.settings = Config.playerInput[`player${playerNumber}`];
    this.gamePad = this.game.input.gamepad[`pad${playerNumber}`];
    this.controller = new Controller(game, this, this.gamePad, this.settings);

    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point(0, 0);
    this.lastDirection = new Point(1, 0);

    this.body.debug = false;
    this.currentMovementSpeed = 0;

    this.isMoving = false;

    this.canBoost = true;
    this.isBoosting = false;
    this.currentDashCoolDown = this.currentStats.dashCooldown;

    this.createSlug();
    this.body.onBeginContact.add(this.onContact, this);

    this.trailParts = [];
    for (let i = 0; i < this.currentStats.maxTrailParts; i += 1) {
      const trailPart = new TrailPart(10, 50);
      this.trailParts.push(trailPart);
      game.add.existing(trailPart);
    }
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
    switch (body.sprite.tag) {
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
    this.currentStats = this.characterStats[Object.keys(this.states)[this.currentState]];
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
      this.currentMovementSpeed += this.currentStats.movementSpeedStep;
    } else if (this.currentDirection.getMagnitude() > 0.2) {
      this.currentMovementSpeed -= this.currentStats.movementSpeedStep * 3;
      this.lastDirection.x = this.currentDirection.x;
      this.lastDirection.y = this.currentDirection.y;
    } else if (this.isMoving) {
      this.isMoving = false;
      this.currentMovementSpeed = 0;
    }
    this.handleBoosting();
    this.currentDirection.multiply(this.currentMovementSpeed, this.currentMovementSpeed);
    this.x += this.currentDirection.x;
    this.y += this.currentDirection.y;
    this.body.moveRight(this.currentDirection.x * 60);
    this.body.moveDown(this.currentDirection.y * 60);
    this.doAnimation();
    this.handleTrailSpawn();
  }

  handleBoosting() {
    if (this.isBoosting) {
      this.currentMovementSpeed -= this.currentStats.speedDecrease;
      if (this.currentMovementSpeed < this.currentStats.maxMovementSpeed) {
        this.currentMovementSpeed = this.currentStats.maxMovementSpeed;
        this.isBoosting = false;
        this.canBoost = false;
      }
    } else {
      this.currentMovementSpeed = Phaser.Math.clamp(this.currentMovementSpeed, 0, this.currentStats.maxMovementSpeed);
      if (!this.canBoost) {
        this.currentDashCoolDown -= game.time.elapsed/1000;
        if (this.currentDashCoolDown <= 0) {
          this.canBoost = true;
          this.currentDashCoolDown = this.currentStats.dashCooldown;
        }
      }
    }
  }
  rotate() {
    // This part makes sure that the last part of the rotation doesn't over shoot.
    const angle = Math.acos(this.currentDirection.dot(this.targetDirection));
    let nextRotation = Phaser.Math.degToRad(this.currentStats.rotationSpeed);
    if (!isNaN(angle)) { // When the angle is to small Math.acos returns NaN In this case we reduce the next rotation.
      if (angle < nextRotation) nextRotation = angle;
    } else {
      nextRotation /= 8;
    }

    // Actual rotate the current direction towards the target direction;
    if (this.targetDirection.x * this.currentDirection.y > this.targetDirection.y * this.currentDirection.x) {
      this.currentDirection.rotate(0, 0, -nextRotation);
    } else {
      this.currentDirection.rotate(0, 0, nextRotation);
    }

    const newAngle = this.currentDirection.angle(new Point(0, 0), true) + 270;
    this.angle = newAngle;
    this.body.angle = this.angle - 90;
  }

  doAnimation() {
    if (this.isMoving) {
      if (this.states.SLUG) this.play('moving');
      else if (this.states.SNAIL) this.play('movingSnail');
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
    this.currentHP = 3;
    this.loadTexture('slug');
    this.scale.set(1, 1);
  }

  switchToSnail() {
    // TODO for testing purposes
    this.loadTexture('snail');
    this.scale.set(1.7, 1.7);
  }

  shoot() {
    if (this.currentState === this.states.SNAIL) return;
    if (this.canBoost) {
      this.canBoost = false;
      this.isBoosting = true;
      this.currentMovementSpeed += this.currentStats.boostSpeed;
    }
  }

  handleTrailSpawn() {
    if(!this.isBoosting) return;
    for (let i = 0; i < this.currentStats.maxTrailParts; i += 1) {
      this.trailParts[i].update();
    }
    this.trailCurrentTime -= game.time.elapsed / 1000;

    if (!this.isMoving) return;
    if (this.trailCurrentTime < 0) {
      this.trailCurrentTime = this.currentStats.trailCooldown;
      this.trailParts[this.trailToSpawn].spawnPart(this.x, this.y, this.angle);
      this.trailToSpawn++;
      if (this.trailToSpawn >= this.currentStats.maxTrailParts - 1) this.trailToSpawn = 0;
    }
  }
}
