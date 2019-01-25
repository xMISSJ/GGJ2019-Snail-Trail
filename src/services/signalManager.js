import Phaser from 'phaser';
import Singleton from './singleton';
import Default from './default';

// Private methods.
const checkValidNamespaceAndSignal = Symbol('checkValidNamespaceAndSignal');
const createSignal = Symbol('createSignal');
const getSignal = Symbol('getSignal');

export default class SignalManager extends Singleton {
  constructor() {
    super();

    this._signals = {};

    // Create all signals
    Default.signalNames.forEach((name) => {
      this[createSignal](name);
    });
  }

  /**
   * Create a new signal. It will fail if the signalName is empty or isn't a string.
   *
   * @returns {*} The new created signal.
   * @param signalName Name of the signal.
   */
  [createSignal](signalName) {
    if ((!signalName || signalName.length === 0) && typeof signalName !== 'string') {
      console.warn("This signal doesn't have a name!");
      return null;
    }

    if (this._signals[signalName]) {
      console.warn(`_signals.${signalName} already exists!`);
      return this._signals[signalName];
    }

    this._signals[signalName] = new Phaser.Signal();

    return this._signals[signalName];
  }

  /**
   * Return the signal
   *
   * @returns {Signal} Return the Phaser.Signal object.
   * @param signalName Name of the signal.
   */
  [getSignal](signalName) {
    return this._signals[signalName];
  }

  /**
   * Dispatch the signal. If the signal doesn't exists, it will create the signal.
   *
   * @param signalName Name of the signal
   */
  dispatch(signalName) {
    const signal = this[getSignal](signalName);

    if (!signal) {
      this[createSignal](signalName);

      console.warn(`_signals.${signalName} does not exists. It has been created, but add it to the default.js too!`);
      return;
    }

    signal.dispatch();
  }

  /**
   * Add an eventlistener to the signal.
   *
   * @param signalName Name of the signal
   * @param callback Callback is called with the signal is dispatched.
   * @param context Context of the callback
   */
  add(signalName, callback, context) {
    if (typeof callback !== 'function') {
      console.warn(`${signalName} does not have a valid callback. This method is ignored.`);
      return;
    }

    const signal = this[getSignal](signalName);

    if (!signal) {
      this[createSignal](signalName);

      console.warn(`_signals.${signalName} does not exists. It has been created, but add it to the default.js too!`);
      return;
    }

    signal.add(callback, context);
  }

  /**
   * Add an eventlistener to the signal.
   * This eventlistener will destroy it self after using it once.
   *
   * @param signalName Name of the signal
   * @param callback Callback is called with the signal is dispatched.
   * @param context Context of the callback
   */
  addOnce(signalName, callback, context) {
    const signal = this[getSignal](signalName) || this[createSignal](signalName);

    signal.addOnce(callback, context);
  }

  /**
   * Checks if the signal exists
   * @returns {boolean} True if the signal exists, else false.
   * @param signalName Name of the signal.
   */
  [checkValidNamespaceAndSignal](signalName) {
    return !!this._signals[signalName];
  }

  /**
   * Return an object with all signals in it.
   * @returns {{}} Object with all signals.
   */
  getAllSignals() {
    // TODO find certain signal
    return this._signals;
  }

  getSignal(name) {
    return this._signals[name];
  }
}
