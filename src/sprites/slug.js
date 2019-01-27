import { Phaser, Point } from 'phaser';
import Sprite from '../services/sprite';
import Config from '../config';
import SignalManager from '../services/signalManager';
import GameManager from '../services/gameManager';
import TrailPart from './trailPart';
import CollisionManager from './collisionManager';
import Explosion from './explosion';
import BackgroundMusic from '../services/backgroundMusic';
import SoundEffects from '../services/soundEffects';

export default class Slug extends Sprite {
  constructor(playerNumber, position, colors) {
    super({ asset: `${colors.color}Slug`, x: position[0], y: position[1] });
    this.color = colors.color;

    this.name = colors.name;
    console.log('name: ', this.name);
    this.states = { SLUG: 0, SNAIL: 1 };
    this.characterStats = game.cache.getJSON('characterSettings');

    this.trailStates = { NO_COLLIDE: 0, COLLIDE: 1 };
    this.currentTrailState = this.trailStates.NO_COLLIDE;

    Object.freeze(this.state);

    this.tag = 'slug';
    this.maxHP = 30;

    this.trailSpeed = 1;
    this.canPickUp = true;
    this.currentState = this.states.SLUG;
    // this.switchState(this.states.SLUG);
    this.characterStats = game.cache.getJSON('characterSettings');
    this.currentStats = this.characterStats[Object.keys(this.states)[this.currentState]];
    this.currentHP = this.maxHP;

    this.collideWithTrail = [];

    this.shell = null;

    this.collidingWith = [];

    this.playerNumber = playerNumber;

    game.physics.p2.enable(this, true);
    // this.body.enable = true;
    this.body.clearShapes();
    this.body.addCapsule(40, 20, 10, 0, 0);
    this.body.fixedRotation = true;
    this.body.angle = 90;
    this.body.collideWorldBounds = true;
    this.scale.set(1, 1);

    this.currentDirection = new Point(1, 0);
    this.targetDirection = new Point(0, 0);
    this.lastDirection = new Point(1, 0);
    this.forceDirection = new Point(1, 0);
    this.currentForce = 0;

    this.body.debug = false;
    this.currentMovementSpeed = 0;

    this.isMoving = false;

    this.canBoost = true;
    this.isBoosting = false;
    this.currentDashCoolDown = this.currentStats.dashCooldown;
    this.canParry = true;
    this.isParrying = false;
    this.currentParryCoolDown = this.currentStats.parryCooldown;

    this.createSlug();
    this.body.onBeginContact.add(this.onBeginContact, this);
    this.body.onEndContact.add(this.onEndContact, this);
    this.trailParts = [];
    for (let i = 0; i < this.currentStats.maxTrailParts; i += 1) {
      const trailPart = new TrailPart(10, 50, this.playerNumber, colors.tint);
      this.trailParts.push(trailPart);
      game.add.existing(trailPart);
    }
    this.trailCurrentTime = 0;
    this.trailToSpawn = 0;

    this.shine = new Sprite({ asset: 'shellShine', scaleX: 0, scaleY: 0 });
    this.shine.alpha = 0.8;
    this.addChild(this.shine);

    SignalManager.instance.add('gameEnd', () => {
      this.targetDirection = new Phaser.Point(0, 0);
      this.currentDirection = new Phaser.Point(0, 0);
    });
  }

  createSlug() {
    this.smoothed = false;
    // SignalManager.instance.dispatch('addSlug', this);
    CollisionManager.instance.addSlug(this);
    this.moving = this.animations.add('movingSlug', [0, 1, 2, 3], 10, true);
    this.hitted = this.animations.add('hittedSlug', [0, 1, 2], 10, true);
    this.movingSnail = this.animations.add('movingSnail', [0, 1, 2, 3], 10, true);
    this.hittedSnail = this.animations.add('hittedSnail', [0, 1, 2], 10, false);
    this.hittedSnail.onComplete.add(() => {
      this.doAnimation();
    });

    // this.idle = this.player.animations.add('idle', [0,3], 10, true);
    this.doAnimation();
  }

  onBeginContact(body) {
    switch (body.sprite.tag) {
      case 'slug':
        this.onCollideSlug(this, body.sprite);
        break;
      case 'shell':
        this.onCollideShell(this, body.sprite);
        break;
    }

    if (body.sprite.tag.includes('trail') && !body.sprite.tag.includes(this.playerNumber)) {
      this.onBeginTrail(body.sprite);
    }
  }

  onEndContact(body) {
    if (!body.sprite) return;
    switch (body.sprite.tag) {
      case 'slug':
        this.onCollideSlugEnd(this, body.sprite)
        break;
      case 'shell':
        break;
      case 'trail':
        this.onEndTrail();
        break;
    }

    if (body.sprite.tag.includes('trail') && !body.sprite.tag.includes(this.playerNumber)) {
      this.onEndTrail(body.sprite);
    }
  }

  onBeginTrail(entity) {
    if (this.isSlug) return;

    this.collideWithTrail.push(entity);
    this.currentTrailState = this.trailStates.COLLIDE;
    this.trailSpeed = 0.3;
  }

  onEndTrail(entity) {
    if (this.isSlug) return;

    for (let i = this.collideWithTrail.length - 1; i >= 0; i -= 1) {
      if (this.collideWithTrail[i] === entity) {
        this.collideWithTrail.splice(i, 1);
      }
    }

    if (this.collideWithTrail.length === 0) {
      this.trailSpeed = 1;
      this.currentTrailState = this.trailStates.NO_COLLIDE;
    }
  }

  onCollideSlug(entity1, entity2) {
    this.collidingWith.push(entity2);

    if (entity2.isBoosting) {
      if (!this.isSnail) return;
      if (this.isParrying) {
        const newExplosion = new Explosion('MEDIUM', this.position);
        newExplosion.start([this]);
        return;
      }
      this.removeHealth(entity1, entity2, 10);
      SoundEffects.instance.onShellHit();
      entity2.isBoosting = false;
      entity2.currentDirection.normalize();
    }
  }

  onCollideSlugEnd(entity1, entity2) {
    for (let i = this.collidingWith.length - 1; i >= 0; i -= 1) {
      if (this.collidingWith[i] === entity2) {
        this.collidingWith.splice(i, 1);
      }
    }
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
    if (!entity1.canPickUp) return;
    entity2.onCollide();
    this.switchState(this.states.SNAIL);
    GameManager.instance.pickUpShell(this.playerNumber);
    game.overlay.start(this.name);
    const newExplosion = new Explosion('MEDIUM', this.position);
    newExplosion.start([entity1]);
    game.world.bringToTop(this);
    this.shell = entity2;
    SoundEffects.instance.onShellHit();
  }

  removeHealth(entity1, entity2, value) {
    if (!this.isSnail) return;

    game.camera.shake(Phaser.Math.clamp(value, 0, 0.05), 100);
    this.currentHP -= value;

    if (this.currentHP <= 0) {
      this.switchState(this.states.SLUG);
      GameManager.instance.dropShell();
      const newExplosion = new Explosion('BIG', this.position);
      newExplosion.start([entity2]);
      this.setVelocity(entity1, entity2, 500);
      if (this.shell) {
        this.shell.onSpawn(this.position);
        game.shellShine.onShellDrop(this.position);
        this.shell = null;
      }
    } else {
      const newExplosion = new Explosion('SMALL', this.position);
      newExplosion.start([entity2]);
      this.doHitAnimation();
    }
  }

  update() {
    if (GameManager.instance.paused) {
      this.body.moveRight(0);
      this.body.moveDown(0);
      return;
    }
    if (this.currentTrailState === this.trailStates.COLLIDE) {
      // this.removeHealth(null, null, game.time.elapsed / 1000);
    }

    this.currentStats = this.characterStats[Object.keys(this.states)[this.currentState]];
    this.currentDirection.normalize();

    if (this.targetDirection.getMagnitude() > 0.2) {
      if (this.currentDirection.getMagnitude() < 0.2) {
        this.isMoving = true;
        this.currentDirection.x = this.lastDirection.x;
        this.currentDirection.y = this.lastDirection.y;
        this.currentDirection.normalize();
      }

      this.rotate();
      if (GameManager.instance.currentState !== GameManager.instance.states.game) {
        return;
      }
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
    this.handleParry();
    this.currentDirection.multiply(this.currentMovementSpeed, this.currentMovementSpeed);

    this.x += (this.currentDirection.x * this.trailSpeed);
    this.y += (this.currentDirection.y * this.trailSpeed);

    this.currentForce *= this.currentStats.forceDrag;
    this.currentForce = this.currentForce < 0.1 ? 0 : this.currentForce;

    this.body.moveRight((this.currentDirection.x * 60 * this.trailSpeed) + this.forceDirection.x * this.currentForce);
    this.body.moveDown((this.currentDirection.y * 60 * this.trailSpeed) + this.forceDirection.y * this.currentForce);

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
        this.currentDashCoolDown -= game.time.elapsed / 1000;
        if (this.currentDashCoolDown <= 0) {
          this.canBoost = true;
          this.trailParts[this.trailToSpawn].spawnPart(this.x, this.y, this.angle, this.playerNumber);
          this.currentDashCoolDown = this.currentStats.dashCooldown;
        }
      }
    }
  }

  handleParry() {
    if (!this.canParry) {
      this.currentParryCoolDown -= game.time.elapsed / 1000;
      if (this.currentParryCoolDown <= 0) {
        this.canParry = true;
        this.currentParryCoolDown = this.currentStats.parryCooldown;
        const shine = game.add.tween(this.shine.scale).to({ x: 0.4, y: 0.4 }, 100, Phaser.Easing.Quadratic.Out, true).yoyo(true);
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
    if (true) {
      if (this.isSlug) {
        this.loadTexture(`${this.color}Slug`);
        this.play('movingSlug');
      } else if (this.isSnail) {
        this.loadTexture(`${this.color}Snail`);
        this.play('movingSnail');
      }
    } else {
      // TODO Play idle
    }
  }

  doHitAnimation() {
    if (this.isSlug) {
      this.loadTexture(`${this.color}SlugHit`);
      this.play('hittedSlug');
    } else if (this.isSnail) {
      this.loadTexture('snailHit');
      this.play('hittedSnail');
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
    this.currentHP = this.maxHP;
    this.scale.set(1, 1);
    this.collideWithTrail.length = 0;
    this.trailSpeed = 1;
    this.currentTrailState = this.trailStates.NO_COLLIDE;


    this.doHitAnimation();
    this.canPickUp = false;
    setTimeout(() => {
      this.doAnimation();
      this.canPickUp = true;
    }, 3000);
  }

  switchToSnail() {
    // TODO for testing purposes
    // this.loadTexture('snail');
    this.doAnimation();
    this.scale.set(1.7, 1.7);
    SoundEffects.instance.setYayName(this.name);
  }

  shoot() {
    if (this.currentState === this.states.SLUG) {
      if (!this.canBoost) return;
      SoundEffects.instance.onBoost();
      game.camera.shake(0.005, 50);
      this.canBoost = false;
      this.isBoosting = true;

      for (let i = 0; i < this.collidingWith.length; i += 1) {
        if (this.collidingWith[i].isSnail) {
          this.collidingWith[i].onCollideSlug(this.collidingWith[i], this);
        }
      }

      this.currentMovementSpeed += this.currentStats.boostSpeed;
    } else if (this.currentState === this.states.SNAIL) {
      if (!this.canParry) return;
      this.canParry = false;
      this.isParrying = true;
      this.loadTexture('snailhouse');
      this.targetDirection = new Phaser.Point(0, 0);
      this.currentDirection = new Phaser.Point(0, 0);
      setTimeout(() => {
        this.doAnimation();
        this.isParrying = false;
        this.loadTexture(`${this.color}Snail`);
        this.play('movingSnail');
        this.currentParryCoolDown = this.currentStats.parryCooldown;
      }, 1000);
    }
  }

  pressA() {
    return;
    this.currentForce = 1500;
    this.forceDirection = new Point(1, 0);
  }

  handleTrailSpawn() {
    if (!this.isBoosting && !this.canBoost) return;
    for (let i = 0; i < this.currentStats.maxTrailParts; i += 1) {
      this.trailParts[i].update();
    }
    this.trailCurrentTime -= game.time.elapsed / 1000;

    if(this.currentState === this.states.SNAIL) return;

    const lifeTImeRatio = this.isBoosting ? 1 : 2;
    const scaleChange = this.isBoosting ? 1 : 0.5;

    if (!this.isMoving) return;
    if (this.trailCurrentTime < 0) {
      this.trailCurrentTime = this.currentStats.trailCooldown;
      this.trailParts[this.trailToSpawn].spawnPart(this.x, this.y, this.angle, lifeTImeRatio, scaleChange);
      this.trailToSpawn++;

      if (this.trailToSpawn >= this.currentStats.maxTrailParts - 1) this.trailToSpawn = 0;
    }
  }

  explode(position, data) {
    setTimeout(() => {
      const distance = Math.hypot(position.x - this.position.x, position.y - this.position.y);
      if (distance < data.explosionRadius) {
        const direction = new Point();
        Point.subtract(this.position, position, direction).normalize();
        if (direction.x === 0 && direction.y === 0) {
          direction.x = Math.random() - 0.5;
          direction.y = Math.random() - 0.5;
          direction.normalize();
        }
        this.forceDirection.setTo(direction.x, direction.y);
        this.currentForce = (data.explosionRadius - distance) * data.explosionForce;
      }
    }, data.explosionFreezeTime * 1000);
  }
}
