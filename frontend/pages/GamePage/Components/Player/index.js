import Koji from 'koji-tools';

/** Class representing a player. */
export default class Player {
  /**
   * Create a player.
   * @param {number} width - Width of canvas.
   * @param {number} height - Height of canvas.
   * @param {Object} context - Canvas context.
   * @param {Object} controller - Controller class.
   */
  constructor({ width, height, context, controller }) {

    this.controller = controller;
    this.width = width;
    this.height = height;
    this.context = context;

    this.playerHeight = controller.getPlayerHeight();
    this.playerWidth = controller.getPlayerWidth();

    this.player = new Image();
    this.player.src = Koji.config.images.playerCarImage;
  }

  /**
   * Rendering player car with rotation
   */
  drawRotated = () => {
    this.context.save();
    this.context.translate(this.controller.getPlayerX(), this.controller.getPlayerY());
    this.context.translate(this.playerWidth/2, this.playerHeight/2);
    this.context.rotate(this.controller.getLeftPointer() ? -0.2 : 0.2);
    this.context.drawImage(
      this.player,
      -this.playerWidth/2,
      -this.playerHeight/2,
      this.playerWidth,
      this.playerHeight
    );
    this.context.restore();
  };

  /**
   * Rendering player car
   */
  render = () => {
    // Check if car drive left or right and rotate car.
    if(this.controller.getLeftPointer() || this.controller.getRightPointer()) {
      this.drawRotated();
    } else {
      this.context.drawImage(
        this.player,
        this.controller.getPlayerX(),
        this.controller.getPlayerY(),
        this.playerWidth,
        this.playerHeight
      );
    }
  };
}