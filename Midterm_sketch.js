//mixkit-arcade-video-game-bonus-2044.wav

let circles = [];
let gameStarted = false;
let score = 0;
let timer;
let timerValue = 60; // 60 seconds (1 minute)
let gameSound;
let gameOverSound;
let startButton;

function preload() {
  gameSound = loadSound('mixkit-arcade-video-game-bonus-2044.wav'); // Load your game sound here
  gameOverSound = loadSound('mixkit-arcade-video-game-bonus-2044.wav'); // Load your game over sound here
}

function setup() {
  createCanvas(400, 400);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  timer = new Timer(timerValue);
  startButton = createButton('Start'); // Create the start button
  startButton.position(width / 2 - 30, height / 2 - 20);
  startButton.mousePressed(startGame);
}

function draw() {
  background(220);

  if (gameStarted) {
    timer.update();
    timer.display();

    if (timer.finished()) {
      gameStarted = false;
      gameSound.stop();
      gameOverSound.play();
      displayGameOver();
    }

    if (random(1) < 0.02) {
      let circleColor = random(['white', 'green', 'yellow', 'black', 'blue', 'red', 'purple']);
      circles.push(new Circle(circleColor));
    }

    for (let i = circles.length - 1; i >= 0; i--) {
      circles[i].display();
      circles[i].move();
      if (circles[i].y > height) {
        if (circles[i].color === 'red') {
          gameSound.stop();
          gameOverSound.play();
          displayGameOver();
        } else if (circles[i].color === 'yellow') {
          score += 10;
          if (score >= 30) {
            circles[i].speed = random(3, 4); // Increase the speed if score is 30 or more
          }
        }
        circles.splice(i, 1);
      }
    }

    textSize(24);
    text('Score: ' + score, width / 2, 30);
  }
}

function startGame() {
  circles = [];
  score = 0;
  gameStarted = true;
  timer.start();
  gameSound.loop();
}

function mouseClicked() {
  if (gameStarted) {
    for (let i = circles.length - 1; i >= 0; i--) {
      if (circles[i].contains(mouseX, mouseY) && circles[i].color === 'red') {
        gameSound.stop();
        gameOverSound.play();
        displayGameOver();
        circles.splice(i, 1);
      } else if (circles[i].contains(mouseX, mouseY) && circles[i].color === 'yellow') {
        score += 10;
        if (score >= 30) {
          circles[i].speed = random(3, 4); // Increase the speed if score is 30 or more
        }
        circles.splice(i, 1);
      }
    }
  }
}

function displayGameOver() {
  gameStarted = false;
  textSize(32);
  text('Game Over', width / 2, height / 2 - 40);
  text('Total Score: ' + score, width / 2, height / 2 + 20);
}

class Circle {
  constructor(color) {
    this.x = random(width);
    this.y = 0;
    this.color = color;
    this.speed = random(1, 3);
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, 30, 30);
  }

  move() {
    this.y += this.speed;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < 15;
  }
}

class Timer {
  constructor(seconds) {
    this.seconds = seconds;
    this.startTime = 0;
    this.running = false;
  }

  start() {
    this.startTime = millis();
    this.running = true;
  }

  update() {
    if (this.running) {
      let elapsed = floor((millis() - this.startTime) / 1000);
      this.remaining = this.seconds - elapsed;
    }
  }

  display() {
    textSize(24);
    text('Time: ' + this.remaining, width / 2, 60);
  }

  finished() {
    return this.remaining <= 0;
  }
}
