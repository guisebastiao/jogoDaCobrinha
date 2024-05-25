class Game {
  constructor() {
    this.messages = document.querySelector(".messages");
    this.canvas = document.querySelector(".canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasSize = 400;
    this.canvasBlockSize = 20;
    this.direction = "down";
    this.gameUpdate = 150;
    this.inteval;
    this.collided = false;
    this.gamePoints = 0;
    this.applePosition = { x: 0, y: 0 }
    this.snakePosition = [
      { x: 20, y: 20 },
      { x: 20, y: 40 },
    ];
    this.colors = {
      groundPrimaryColor: "#AAD751",
      groundSecondColor: "#A2D149",
      appleColor: "#E7471D",
      snakeColor: "#4775EA",
    }
  }

  setCanvas() {
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
  }

  cenary() {
    let color = this.colors.groundPrimaryColor;

    for (let y = 0; y <= this.canvasSize; y += this.canvasBlockSize) {
      for (let x = 0; x <= this.canvasSize; x += this.canvasBlockSize) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.canvasBlockSize, this.canvasBlockSize);
        color === this.colors.groundPrimaryColor ? color = this.colors.groundSecondColor : color = this.colors.groundPrimaryColor;
      }
    }
  }

  controls() {
    const handleKey = (key) => {
      switch (key.keyCode) {
        case 87 || 38: {
          if (this.direction !== "down") {
            this.direction = "up";
            this.sounds.up();
          }

          break;
        }
        case 83 || 40: {
          if (this.direction !== "up") {
            this.direction = "down";
            this.sounds.down();
          }

          break;
        }
        case 65 || 37: {
          if (this.direction !== "right") {
            this.direction = "left";
            this.sounds.left();
          }

          break;
        }
        case 68 || 39: {
          if (this.direction !== "left") {
            this.direction = "right";
            this.sounds.right();
          }

          break;
        }
      }
    }

    document.addEventListener("keydown", handleKey);
  }

  movimentSnake() {
    const head = this.snakePosition[this.snakePosition.length - 1];

    switch (this.direction) {
      case "up": {
        this.snakePosition.push({ x: head.x, y: head.y -= this.canvasBlockSize });
        break;
      }
      case "down": {
        this.snakePosition.push({ x: head.x, y: head.y += this.canvasBlockSize });
        break;
      }
      case "left": {
        this.snakePosition.push({ x: head.x -= this.canvasBlockSize, y: head.y });
        break;
      }
      case "right": {
        this.snakePosition.push({ x: head.x += this.canvasBlockSize, y: head.y });
        break;
      }
    }

    this.snakePosition.shift();
  }

  drawSnake() {
    this.ctx.fillStyle = this.colors.snakeColor;

    this.snakePosition.forEach(pos => {
      this.ctx.fillRect(pos.x, pos.y, this.canvasBlockSize, this.canvasBlockSize);
    });
  }

  drawApple() {
    this.ctx.fillStyle = this.colors.appleColor;
    this.ctx.fillRect(this.applePosition.x, this.applePosition.y, this.canvasBlockSize, this.canvasBlockSize);
  }

  appleColision() {
    const headSnake = this.snakePosition[this.snakePosition.length - 1];

    if (headSnake.x === this.applePosition.x && headSnake.y === this.applePosition.y) {
      this.snakePosition.push({ x: this.applePosition.x, y: this.applePosition.y });
      this.randomPositionApple();
      this.sounds.eat();
      this.gamePoints++
      this.messages.innerHTML = "Pontos " + this.gamePoints;
    }
  }

  randomPositionApple() {
    let position;

    const random = () => {
      return Math.floor(Math.random() * this.canvasBlockSize) * this.canvasBlockSize;
    }

    const checkPosition = () => {
      this.snakePosition.forEach(pos => {
        if (pos.x === position.x && pos.y === position.y) {
          generatePosition();
        }
      });
    }

    const generatePosition = () => {
      position = { x: random(), y: random() }
      checkPosition();
    }

    generatePosition();
    this.applePosition = position;
  }

  snakeColision() {
    const head = this.snakePosition[this.snakePosition.length - 1];

    for (let i = 0; i < this.snakePosition.length - 3; i++) {
      if (this.snakePosition[i].x === head.x && this.snakePosition[i].y === head.y) {
        this.collided = true;
      }
    }

    if (head.x < 0 || head.x >= this.canvasSize || head.y < 0 || head.y >= this.canvasSize) {
      this.collided = true;
    }

    if (this.collided === true) {
      this.sounds.dead();
      this.messages.innerHTML = "VOCÊ MORREU!";
      clearInterval(this.inteval);
    }
  }

  get sounds() {
    return {
      up: () => {
        const sound = new Audio();
        sound.src = "./audio/soundUp.mp3";
        sound.play();
      },
      down: () => {
        const sound = new Audio();
        sound.src = "./audio/soundDown.mp3";
        sound.play();
      },
      left: () => {
        const sound = new Audio();
        sound.src = "./audio/soundLeft.mp3";
        sound.play();
      },
      right: () => {
        const sound = new Audio();
        sound.src = "./audio/soundRight.mp3";
        sound.play();
      },
      eat: () => {
        const sound = new Audio();
        sound.src = "./audio/soundEat.mp3";
        sound.play();
      },
      dead: () => {
        const sound = new Audio();
        sound.src = "./audio/soundDead.mp3";
        sound.play();
      }
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
    this.cenary();
    this.drawSnake();
    this.movimentSnake();
    this.drawApple();
    this.appleColision();
    this.snakeColision();
  }

  gameloop() {
    this.inteval = setInterval(() => this.update(), this.gameUpdate);
  }

  init() {
    this.setCanvas();
    this.controls();
    this.drawApple();
    this.randomPositionApple();
    this.gameloop();
  }
}

const game = new Game();
game.init();
