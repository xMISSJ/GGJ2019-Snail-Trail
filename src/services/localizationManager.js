import Facebook from './facebook';
import Singleton from './singleton';
import Default from './default';

// Private methods.
const validateLocale = Symbol('validateLocale');

/**
 * A manager to control the localisation.
 * It downloads the correct language pack and translate a key to a text.
 */
export default class LocalisationManager extends Singleton {
  constructor() {
    super();

    this.locale = Facebook.instance.getLocale();
    this[validateLocale]();
  }

  /**
   * Download the language pack
   * @param callback The callback is executed when it's done loading.
   * @param context The context of the callback.
   */
  loadLanguagePackage(callback, context) {
    game.load.crossOrigin = 'anonymous';
    game.load.json(this.language, `${Default.language.path}${this.language}.json`);
    game.load.onLoadComplete.add(() => {
      console.log(`${this.language} has been downloaded.`);
      this.languagePack = game.cache.getJSON(this.language);

      if (callback) {
        callback.call(context);
      }
    });
  }

  /**
   * Return the correct text.
   *
   * @param key Unique key name.
   * @returns {*} Return the value or the key.
   */
  getLocalisation(key) {
    if (!this.languagePack) {
      console.warn('Language pack has not been downloaded!');
      return key;
    }

    return this.languagePack[key] || key;
  }

  /**
   * Validate the local. It returns the correct language. If the language doesn't exists in the
   * Default class, it will return the default language.
   */
  [validateLocale]() {
    switch (this.locale) {
      case 'en_US':
        this.language = 'us';
        break;
      default: this.language = this.locale.substring(0, 2);
    }

    if (!Default.language.supported.includes(this.language)) {
      this.language = Default.language.default.substring(0, 2);
    }
  }
}
