// Singleton controller class
export default class Controller {
  /**
   * Create a background.
   * @param {number} width - Width of canvas.
   * @param {number} height - Height of canvas.
   * @param {number} speed - Cars default speed.
   * @param {number} offset - Page offset.
   * @param {number} speedAddTime - Time.
   * @param {number} speedStep - Step.
   */
  constructor({ width, height, speed, speedAddTime, speedStep, offset }) {
    this.__intersect = false;
    this.__speed = speed;
    this.__offset = offset;
    this.__speedAddTime = speedAddTime;
    this.__speedStep = speedStep;

    // Canvas width/ height
    this.__width = width;
    this.__height = height;

    // Player width/ height
    this.__playerWidth = width / 10;
    this.__playerHeight = width / 5;

    // Player starting coordinates
    this.__playerX = width / 2 - this.__playerWidth / 2;
    this.__playerY = height - this.__playerHeight - 10;

    // Pointers for moving car
    this.__leftPointer = null;
    this.__rightPointer = null;
    this.__topPointer = null;
    this.__bottomPointer = null;

    this.__score = 0;

    this.__paused = false;

    window.addEventListener('keydown', this.__keyDown, false);
    window.addEventListener('keyup', this.__keyUp, false);
    window.addEventListener('touchstart', this.__touchStart, false);
    window.addEventListener('touchend', this.__touchEnd, false);

    window.addEventListener('focus', this.__resumeGame, false);
    window.addEventListener('blur', this.__pauseGame, false);

    this.__addSpeed();
  }

  __addSpeed = () => {
    setInterval(() => {
      this.__speed = this.__speed + this.__speedStep;
    }, this.__speedAddTime*1000);
  };

  __pauseGame = () => this.__paused = true;

  __resumeGame = () => this.__paused = false;

  __stopPropagation = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  __touchStart = e => {
    this.__stopPropagation(e);
    const { clientX, clientY } = e.touches[0];

    if(clientX < this.__playerX) {
      this.__leftPointer = setInterval( () => {
        if(this.__playerX >  10 + this.__offset) {
          this.setPlayerX(this.__playerX - 10);
        }
      }, 20);
    }

    if(clientX > this.__playerX + this.__playerWidth) {
      this.__rightPointer = setInterval(() => {
        if(this.__playerX < this.__width-this.__playerWidth-this.__offset-10) {
          this.setPlayerX(this.__playerX + 10);
        }
      }, 20);
    }
  };

  __touchEnd = e => {
    this.__stopPropagation(e);
    clearInterval(this.__bottomPointer);
    clearInterval(this.__rightPointer);
    clearInterval(this.__leftPointer);
    clearInterval(this.__topPointer);
    this.__bottomPointer = null;
    this.__rightPointer = null;
    this.__leftPointer = null;
    this.__topPointer = null;
  };

  __keyDown = e => {
    this.__stopPropagation(e);

    if(e.which === 37 && !this.__leftPointer) {
      this.__leftPointer = setInterval( () => {
        if(this.__playerX > this.__offset) {
          this.setPlayerX(this.__playerX - 10);
        }
      }, 20);
    }

    if(e.which === 38 && !this.__topPointer) {
      this.__topPointer = setInterval( () => {
        if(this.__playerY >  10) {
          this.setPlayerY(this.__playerY - 10);
        }
      }, 20);
    }

    if(e.which === 39 && !this.__rightPointer) {
      this.__rightPointer = setInterval(() => {
        if(this.__playerX < this.__width-this.__playerWidth-this.__offset) {
          this.setPlayerX(this.__playerX + 10);
        }
      }, 20);
    }

    if(e.which === 40 && !this.__bottomPointer) {
      this.__bottomPointer = setInterval(() => {
        if(this.__playerY < this.__height  - this.__playerHeight - 10) {
          this.setPlayerY(this.__playerY + 10);
        }
      }, 20);
    }
  };

  __keyUp = e => {
    this.__stopPropagation(e);

    if(e.which === 37) {
      clearInterval(this.__leftPointer);
      this.__leftPointer = null;
    }

    if(e.which === 38) {
      clearInterval(this.__topPointer);
      this.__topPointer = null;
    }

    if(e.which === 39) {
      clearInterval(this.__rightPointer);
      this.__rightPointer = null;
    }

    if(e.which === 40) {
      clearInterval(this.__bottomPointer);
      this.__bottomPointer = null;
    }
  };

  setPlayerX = value => this.__playerX = value;

  getPlayerX = () => this.__playerX;

  setPlayerY = value => this.__playerY = value;

  getPlayerY = () => this.__playerY;

  getSpeed = () => this.__speed;

  getScore = () => this.__score;

  setScore = value => this.__score = value;

  getPlayerWidth = () => this.__playerWidth;

  getPlayerHeight = () => this.__playerHeight;

  getRightPointer = () => this.__rightPointer;

  getLeftPointer = () => this.__leftPointer;

  getGameStatus = () => this.__paused;

  getIntersect = () => this.__intersect;

  setIntersect = value => this.__intersect = value;

  checkIntersect = (enemy, player = {}) => {
    const x1 = player.x1 || this.__playerX;
    const y1 = player.y1 || this.__playerY;
    const x2 = player.x2 || this.__playerX + this.__playerWidth;
    const y2 = player.y2 || this.__playerY + this.__playerHeight;

    const a1 = enemy.x;
    const b1 = enemy.y;
    const a2 = enemy.x + this.__playerWidth;
    const b2 = enemy.y + this.__playerHeight;

    const intersect = (x1 > a1 && x1 < a2 && y1 > b1 && y1 < b2)
      || (x2 > a1 && x2 < a2 && y1 > b1 && y1 < b2)
      || (x1 > a1 && x1 < a2 && y2 > b1 && y2 < b2)
      || (x2 > a1 && x2 < a2 && y2 > b1 && y2 < b2);

    if (!player.x1 && intersect) this.__intersect = true;

    return intersect;
  };
}