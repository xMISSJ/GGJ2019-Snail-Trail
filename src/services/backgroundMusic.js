import Singleton from './singleton';

export default class BackgroundMusic extends Singleton {
  constructor() {
    super();

    this._soundList = [];
  }

}