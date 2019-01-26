import Singleton from './singleton';

/**
 * This class contains all data for loading assets. This way the boot.js stays clean.
 * Only this class needs to be adjusted for loading new assets.
 * Only the code above this description has to be adjusted per project.
 */
export default class PlayerMapping extends Singleton {
  constructor() {
    super();
    game.totalPlayers = 0;
    game.playerSettings = [];
  }

  addPlayer(gamePad) {
    console.log(gamePad);
    game.totalPlayers++;
    game.playerSettings.push({
      controller: gamePad,
    })
    
    // TODO: Set collor in playerSettings;
  }

}