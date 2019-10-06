import Koji from 'koji-tools';

/**
 * Generating random number
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @return {number} Random number.
 */
function randGen(min, max) {
  return Math.floor((Math.random() * max) + min);
}

/** Class representing a player. */
export default class Enemy {
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

    this.playerWidth = controller.getPlayerWidth();
    this.playerHeight = controller.getPlayerHeight();

    // Getting lines count in road
    this.lineCount = width / this.playerWidth;

    // Lines coordinates
    this.linesCoordinates = [];

    // Calculating coordinates of lines
    for(let i = this.lineCount; i > 0; i--) {
      const offset = i === 1 ? -(35 + this.playerWidth) : i === 10 ? 35 : 0;

      this.linesCoordinates.push({
        line: i,
        x: this.width - ( this.width/10*i ) + offset,
      });
    }

    // New random enemy car image
    const enemy = new Image();
    enemy.src = Koji.config.images[`car${randGen(1, 5)}`];

    // Enemies on map
    this.enemies = [];

    this.timeOut = null;

    this.createEnemy();

    this.render();
  }

  /**
   * Recursive generate enemies
   * with Time out
   */
  createEnemy = () => {

    const car = new Image();
    car.src = Koji.config.images[`car${randGen(1, 5)}`];

    const randoms = this.generateRandom();

    if (!this.controller.getGameStatus() && typeof randoms !== 'boolean') {
      this.enemies.push({
        element: car,
        ...randoms,
      });
    }

    this.timeOut = setTimeout(() => {
      this.createEnemy();
    }, randGen(100-this.controller.getSpeed()*20, 700-this.controller.getSpeed()*20))
  };

  /**
   * Generate random coordinates
   * fir every enemy
   */
  generateRandom = () => {
    const line = this.linesCoordinates[randGen(0, 9)];
    const enemyX1 = line.x;
    const enemyY1 = -this.playerHeight;
    const speed = this.controller.getSpeed();

    const enemies = [ ...this.enemies ];

    // Checking is there any cars with same coordinates
    const sorted = enemies.filter(item =>
      line.line - 1 > item.line || item.line < line.line + 1
    ).sort((a,b) => a.y - b.y);

    if(sorted[0] && sorted[0].y < this.playerHeight) {
      return false;
    } else {
      return { x: enemyX1, y: enemyY1, line: line.line, speed };
    }
  };

  /**
   * Rendering enemies
   */
  render = () => {
    // Check if game is over stop randering
    if(this.controller.getIntersect())  {
      clearTimeout(this.timeOut);
    }

    this.enemies.forEach((enemy, key) => {
      this.controller.checkIntersect(enemy);

      this.context.drawImage(enemy.element, enemy.x, enemy.y, this.playerWidth, this.playerHeight);

      if(enemy.y > this.height) {
        this.enemies.splice(key, 1);
        this.controller.setScore(this.controller.getScore() + 1);
      }

      enemy.y += this.controller.getSpeed();
    });
  };
}