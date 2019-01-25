import { Text, Point } from 'phaser';
import Default from './default';
import LocalisationManager from './singleton';

export default class extends Text {
  constructor({
    text = '', position = new Point(0, 0), anchor = new Point(0.5, 0.5), fontSize = 20,
    fontName = Default.text.font, fontWeight = 'normal', color = Default.text.color,
    align = Default.text.align, boundsAlignH = Default.text.boundsAlignH,
    boundsAlignV = Default.text.boundsAlignV, stroke = Default.text.stroke,
    strokeThickness = Default.text.strokeThickness, inputEnabled = false,
    localisationKey = null, stringVariables, wordWrap = false, wordWrapWidth = 100,
  }) {
    super(game, position.x, position.y, text);

    this.setStyle({
      font: `${fontWeight} ${fontSize}pt ${fontName}`,
      fill: color,
      align,
      boundsAlignH,
      boundsAlignV,
      stroke,
      strokeThickness,
      wordWrap,
      wordWrapWidth,
    });

    this.anchor.setTo(anchor.x, anchor.y);
    this.inputEnabled = inputEnabled;
    this.localisationKey = localisationKey;

    if (this.localisationKey !== null) {
      this.setLocalisationText(this.localisationKey, stringVariables);
    } else {
      this.text = this.localisationKey || text;
    }
  }

  setLocalisationText(key, variables) {
    const text = LocalisationManager.instance.getLocalisation(key).replace('\u0003', '');

    if (!Array.isArray((variables))) {
      if (variables) {
        for (let i = 0; i < variables.length; i += 1) {
          this.text = this.text.replace(`{${i}}`, variables[i]);
        }
      }

      return;
    }

    this.text = text;
  }
}
