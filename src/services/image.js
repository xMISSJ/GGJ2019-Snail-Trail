import { Image, Point } from 'phaser';

/**
 * This is the general Image class used for displaying images in game.
 * The settings of the images can easily be set using an object as the constructor.
 * It accepts the following keys:
 * key {string} The key of the texture*.
 * frame {string} If the texture is using an atlas, you can specify the frame of the texture atlas.
 * position Point Position of the image. Default value is { x: 0, y: 0 }.
 * anchor Point Anchor of the image. Default value is { x: 0.5, y: 0.5 }.
 * scale {[number [,number]]} The scale of the image. If the second index is undefined,
 * inputEnabled {bool} Set to true if click events are required for this image. Default is false;
 */
export default class extends Image {
  constructor({
    key, frame, position = new Point(0, 0), anchor = new Point(0.5, 0.5), scale = new Point(1, 1),
    inputEnabled = false,
  }) {
    super(game, position.x || 0, position.y || 0, key, frame);

    this.anchor.setTo(anchor.x, anchor.y);
    this.scale.setTo(scale.x, scale.y);
    this.inputEnabled = inputEnabled;

    if (inputEnabled) {
      this.inputEnabled = inputEnabled;

      this.events.onInputUp.add(() => {
        this.doInputUp();
      });

      this.events.onInputDown.add(() => {
        this.doInputDown();
      });
    }
  }

  /**
   * When the image is clicked and the input is down this method is called.
   * Override this method.
   */
  doInputDown() {
    console.warn("This image doesn't have a input down function, please override this function");
  }

  /**
   * When the image is clicked and the input is up this method is called.
   * Override this method.
   */
  doInputUp() {
    console.warn("This image doesn't have a input up function, please override this function");
  }
}
