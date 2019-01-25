import Singleton from './singleton';

// Private methods.
const doCallback = Symbol('_doCallback');
const initializeAsync = Symbol('_initializeAsync');

/**
 * All Facebook Instant Games API's are in this script.
 */
export default class Facebook extends Singleton {
  /**
   * This method is used to create the game.
   *
   * @param Game Reference to the Phaser Game.
   */
  initializeGame(Game) {
    const conditions = [':3000'];

    this.fBInstantExists = !conditions.some(el => window.location.href.includes(el));
    this.startGameAsyncFinished = false;

    if (this.fBInstantExists) {
      this[initializeAsync](Game);
    } else {
      window.game = new Game();
    }
  }

  /**
   * Execute FBInstant.initializeAsync.
   *
   * @param Game Reference to the Phaser.Game
   */
  // eslint-disable-next-line
  [initializeAsync](Game) {
    FBInstant.initializeAsync().then(() => {
      window.game = new Game();
    });
  }

  /**
   * Execute FBIntant.setLoadingProgress
   *
   * @param progress The progress of downloading assets in percentage.
   */
  setLoadingProgress(progress) {
    if (!this.fBInstantExists) {
      return;
    }

    FBInstant.setLoadingProgress(progress);
  }

  /**
   * Execute FBInstant.startGameAsync
   *
   * @param callback Execute the callback when startGameAsync is resolved.
   * @param context The context of the callback.
   */
  startGameAsync(callback, context) {
    if (!this.fBInstantExists) {
      this.startGameAsyncFinished = true;
      this[doCallback](callback, context);
      return;
    }

    FBInstant.startGameAsync()
      .then(() => {
        this.startGameAsyncFinished = true;
        this[doCallback](callback, context);
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  /**
   * Execute FBInstant.getLocale.
   *
   * @returns string Return the locale.
   */
  getLocale() {
    if (!this.fBInstantExists) {
      // For testing purposes
      return 'fr_FR';
    }
    if (!this.startGameAsyncFinished) {
      console.warn("startGameAsync hasn't resolved yet");
    }

    return FBInstant.getLocale();
  }

  /**
   * Execute the callback.
   *
   * @param callback The callback that needs to be executed.
   * @param context The context of the callback.
   * @param parameter The parameters for the callback.
   */
  // eslint-disable-next-line
  [doCallback](callback, context, parameter) {
    if (callback) {
      callback.call(context, parameter);
    }
  }
}
