import Koji from 'koji-tools';

/** Class representing a background. */
export default class Background {
  /**
   * Create a background.
   * @param {number} width - Width of canvas.
   * @param {number} height - Height of canvas.
   * @param {Object} context - Canvas context.
   * @param {Object} controller - Controller class.
   */
  constructor({ width, height, context, controller }) {
    this.controller = controller;

    this.background = new Image();

    this.background.src = Koji.config.images.roadImage;

    this.context = context;

    this.height = height;
    this.width = width;

    this.zeroLine = -(this.height * 2);
    this.firstLine = -this.height;
    this.secondLine = 0;
  }

  /**
   * Initializing background image
   * @return {Promise} Promise value.
   */
  onInit = () => {
    return new Promise((res, rej) => {
      this.background.onload = () => {
        res();
      }
    })
  };

  /**
   * Rendering background image
   * with different coordinates
   */
  render = () => {
    this.context.drawImage(this.background, 0, this.zeroLine, this.width, this.height);
    this.context.drawImage(this.background, 0, this.firstLine, this.width, this.height);
    this.context.drawImage(this.background, 0, this.secondLine, this.width, this.height);

   if(this.controller.getIntersect())  return false;

    if(this.firstLine >= 0) {
      this.zeroLine = -(this.height*2);
      this.firstLine = -this.height;
      this.secondLine = 0;
    } else {
      this.zeroLine = this.zeroLine + this.controller.getSpeed() + 2;
      this.firstLine = this.firstLine + this.controller.getSpeed() + 2;
      this.secondLine = this.secondLine + this.controller.getSpeed() + 2;
    }
  };
}