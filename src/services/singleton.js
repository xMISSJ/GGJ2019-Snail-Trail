const singleton = Symbol('singleton');

/**
 * This is the super class singleton. Inherit this class if you want to create a singleton
 * You can either use [SUBCLASS_NAME].instance or new [SUBCLASS_NAME], but [SUBCLASS_NAME].instance
 * is preferred, because no new instance is created.
 */
export default class Singleton {
  static get instance() {
    if (!this[singleton]) {
      this[singleton] = new this();
    }

    return this[singleton];
  }

  constructor() {
    const Class = this.constructor;

    if (!Class[singleton]) {
      Class[singleton] = this;
    }

    return Class[singleton];
  }
}
