"use strict";

const playerSpriteSize = { width: 50, height: 37 };

const playerIdle = new Image();
playerIdle.src = "./assets/player/idle.png";

const playerRun = new Image();
playerRun.src = "./assets/player/run.png";

const playerJump = new Image();
playerJump.src = "./assets/player/jump.png";

const playerAttack = new Image();
playerAttack.src = "./assets/player/attack.png";

let idleTimeout;

// AnimationState must match playerAnimations array!!!
const AnimationState = {
  IDLE: 0,
  RUNNING: 1,
  JUMPING: 2,
  ATTACKING: 3,
};
Object.freeze(AnimationState);
// Array items must match AnimationState index!!!
const playerAnimations = [
  { sheetSrc: playerIdle, sheetSize: 4, isInfinite: true },
  { sheetSrc: playerRun, sheetSize: 6, isInfinite: true },
  { sheetSrc: playerJump, sheetSize: 4, isInfinite: false },
  { sheetSrc: playerAttack, sheetSize: 6, isInfinite: false }
];

let counting = 0;


// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
class Player {
  constructor() {
    this.x = 100,
      this.y = 50,
      this.width = 85,
      this.height = 63,
      this.hSpeed = 0,
      this.damage = 10,
      this.speed = 25,
      this.vSpeed = 0,
      this.maxVSpeed = 53,
      this.maxJumps = 2,
      this.isTouchingGround = false,
      this.isAttacking = false,
      this.activeAnimation = {
        sheetSrc: playerIdle,
        sheetSize: 4,
        currentSprite: 0,
        currentState: AnimationState.IDLE,
        currentRow: 0,
        isInfinite: true,
      }
  }

  draw(ctx, fps) {
    const minFrame = this.activeAnimation.sheetSize < 6 ? 6 : this.activeAnimation.sheetSize;
    counting++;
    if (counting % minFrame === 0) {
      counting = 0;
      if (this.activeAnimation.currentSprite < this.activeAnimation.sheetSize - 1) {
        this.activeAnimation.currentSprite++;
      } else if (this.activeAnimation.isInfinite) {
        this.activeAnimation.currentSprite = 0;
      }
    }
    // First row moving right, second row moving left 
    // Usually this is done with scaling so sprites don't need to be duplicated, 
    // but canvas.scale have issues with it (or at least I have with canvas x.x)
    if (this.hSpeed > 0) {
      this.activeAnimation.currentRow = 0;
    } else if (this.hSpeed < 0) {
      this.activeAnimation.currentRow = 1;
    }

    ctx.drawImage(
      this.activeAnimation.sheetSrc,
      this.activeAnimation.currentSprite * playerSpriteSize.width,
      this.activeAnimation.currentRow * playerSpriteSize.height,
      playerSpriteSize.width,
      playerSpriteSize.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

  }

  // Update method fixes javascript's key input delay
  update() {
    secondsPassed = secondsPassed * 10;
    // First frame fix
    if (isNaN(secondsPassed)) {
      console.warn("Player -> update() -> secondsPassed is NAN!");
      return;
    }

    if (this.vSpeed < this.maxVSpeed) {
      this.vSpeed += GRAVITY * secondsPassed;
    }

    this.horizontalUpdate();
    this.verticalUpdate();

    if (!this.isTouchingGround) {
      this.setPlayerAnimationState(AnimationState.JUMPING);
    } else {
      if (this.hSpeed === 25 || this.hSpeed === -25) {
        this.setPlayerAnimationState(AnimationState.RUNNING);
        clearTimeout(idleTimeout);
      } else {
        if (this.activeAnimation.currentState !== AnimationState.IDLE) {
          idleTimeout = setTimeout(
            () => this.setPlayerAnimationState(AnimationState.IDLE),
            100
          );
        }
      }
    }

    // Collision detection
    if (this.y > canvas.height - this.height - 10) {
      this.isTouchingGround = true;
      this.maxJumps = 2;
      this.y = canvas.height - this.height - 9;
      this.vSpeed = 0;
    }
  }

  horizontalUpdate() {
    if (this.hSpeed === 0) {
      return;
    }
    this.x += this.hSpeed * secondsPassed;
  }

  verticalUpdate() {
    if (this.vSpeed === 0) {
      return;
    }
    this.y += this.vSpeed * secondsPassed;
  }

  move(isMovingRigh) {
    if (isMovingRigh) {
      this.hSpeed = this.speed;
      return;
    }
    this.hSpeed = -this.speed;
  }

  stop() {
    this.hSpeed = 0;
  }

  jump() {
    if (this.maxJumps > 0) {
      this.isTouchingGround = false;
      this.maxJumps -= 1;
      this.vSpeed = -32;
      if (!this.isAttacking) {
        this.setPlayerAnimationState(AnimationState.JUMPING);
        this.activeAnimation.currentSprite = 0;
      }
    }
  }

  resetJump() { }

  // can be used for some cool items like power-ups! 
  // Be sure to reset it after power up is spent.
  setHorizontalSpeed(speed) {
    this.hSpeed = speed;
  }

  attack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.setPlayerAnimationState(AnimationState.ATTACKING);
      setTimeout(() => this.resetAttack(), 500);
    }

  }

  resetAttack() {
    this.isAttacking = false;
  }

  setPlayerAnimationState(state) {

    // Attack is main animation so it cannot be interupted
    // Jump will interrupt others but not attack
    if ((this.isAttacking && state !== AnimationState.ATTACKING) || this.activeAnimation.currentState === state) {
      return;
    }

    // TO-DO -> Automatically calculate sheet lenght
    const animation = playerAnimations[state];
    this.activeAnimation.sheetSize = animation.sheetSize;
    this.activeAnimation.sheetSrc = animation.sheetSrc;
    this.activeAnimation.isInfinite = animation.isInfinite;

    // Reset it to 0
    this.activeAnimation.currentState = state;
    this.activeAnimation.currentSprite = 0;






    // Old code before refactoring (show dirty laundary why not?).
    // Before const playerAnimations is created
    return;
    console.log("Animation staet", state);
    console.log(this);
    switch (state) {
      case AnimationState.IDLE: {
        this.activeAnimation.sheetSrc = playerIdle;
        this.activeAnimation.sheetSize = 4;
        this.activeAnimation.isInfinite = true;

        break;
      }
      case AnimationState.RUNNING: {
        this.activeAnimation.sheetSrc = playerRun;
        this.activeAnimation.sheetSize = 6;
        this.activeAnimation.isInfinite = true;
        break;
      }
      case AnimationState.JUMPING: {
        this.activeAnimation.sheetSrc = playerJump;
        this.activeAnimation.sheetSize = 4;
        this.activeAnimation.isInfinite = false;
        break;
      }
    }
    // Reset it to 0
    this.activeAnimation.currentState = state;
    this.activeAnimation.currentSprite = 0;
  }
  // https://www.genericgamedev.com/general/basic-game-physics-fluid-movement/
}
