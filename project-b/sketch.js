let character;
let gameMap;
let currentScreen = 'map';
let currentFlag = 0;
let fireParticles = [];
let waves = [];


class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.s = 20;
    this.speed = 5;
  }

  display() {
    let s = this.s;
    let x = this.x;
    let y = this.y;

    // 头
    noStroke();
    fill(240, 216, 202);
    circle(x, y - s * 0.4, s * 0.9);

    // 身体
    fill(233, 215, 192);
    rectMode(CENTER);
    rect(x, y + s * 0.4, s * 0.6, s * 0.8);

    // 手臂
    stroke(240, 216, 202);
    strokeWeight(3);
    line(x - s * 0.3, y + s * 0.2, x - s * 0.6, y + s * 0.4);
    line(x + s * 0.3, y + s * 0.2, x + s * 0.6, y + s * 0.4);

    // 腿
    line(x - s * 0.1, y + s * 0.8, x - s * 0.2, y + s * 1.3);
    line(x + s * 0.1, y + s * 0.8, x + s * 0.2, y + s * 1.3);
  }

  move(dx, dy) {
    let newX = this.x + dx;
    let newY = this.y + dy;

    if (this.isOnPath(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }

  isOnPath(x, y) {
    // 路检测
    if (x >= 0 && x <= 250 && y >= 100 && y <= 150) {
      return true;
    }
    if (x >= 200 && x <= 250 && y >= 150 && y <= 325) {
      return true;
    }
    if (x >= 200 && x <= 400 && y >= 300 && y <= 350) {
      return true;
    }
    if (x >= 350 && x <= 400 && y >= 250 && y <= 350) {
      return true;
    }
    if (x >= 375 && x <= 575 && y >= 250 && y <= 300) {
      return true;
    }
    if (x >= 525 && x <= 575 && y >= 300 && y <= 400) {
      return true;
    }
    if (x >= 550 && x <= 800 && y >= 350 && y <= 400) {
      return true;
    }

    return false;
  }

  checkFlag() {
    // 旗子1
    if (this.x >= 120 && this.x <= 180 && this.y >= 100 && this.y <= 150) {
      return 1;
    }
    // 旗子2
    if (this.x >= 420 && this.x <= 480 && this.y >= 250 && this.y <= 300) {
      return 2;
    }
    // 旗子3
    if (this.x >= 640 && this.x <= 700 && this.y >= 350 && this.y <= 400) {
      return 3;
    }
    return 0;
  }
}


class GameMap {
  constructor() { }

  display() {
    // 路
    noStroke();
    fill(139, 69, 19);
    rectMode(CENTER);
    rect(125, 125, 250, 50);
    rect(225, 225, 50, 200);
    rect(300, 325, 200, 50);
    rect(375, 300, 50, 100);
    rect(475, 275, 200, 50);
    rect(550, 350, 50, 100);
    rect(675, 375, 250, 50);

    // 旗子底座
    fill(192, 180, 142);
    rect(150, 200, 50);
    rect(450, 200, 50);
    rect(670, 300, 50);

    // 旗子
    this.drawFlag(150, 200);
    this.drawFlag(450, 200);
    this.drawFlag(670, 300);
  }

  drawFlag(x, y) {
    stroke(180, 95, 6);
    strokeWeight(5);
    noFill();
    line(x, y - 50, x, y);
    fill(180, 95, 6);
    beginShape();
    vertex(x, y - 50);
    vertex(x + 20, y - 40);
    vertex(x, y - 30);
    endShape();
    line(x - 5, y, x + 5, y);
  }
}

// 打铁花


class BottomParticle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = random(3, 8);
    this.speedX = random(-2, 2);
    this.speedY = random(-10, -5);
    this.gravity = 0.1;
    this.life = 255;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 2;
  }

  display() {
    let alpha = this.life;

    if (this.life > 150) {
      fill(255, 255, 0, alpha);
    } else if (this.life > 50) {
      fill(255, 100, 0, alpha);
    } else {
      fill(255, 0, 0, alpha);
    }

    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size);
  }
}


class RotateParticle {
  constructor(startX, startY) {
    this.x0 = startX;
    this.y0 = startY;
    this.x = 0;
    this.y = 0;
    this.size = random(3, 8);
    this.speedX = random(-10, 10);
    this.speedY = random(-10, 10);
    this.life = 255;
    this.angle = 0;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 2;
    this.angle += 5;
  }

  display() {
    let alpha = this.life;

    if (this.life > 150) {
      fill(255, 255, 0, alpha);
    } else if (this.life > 50) {
      fill(255, 100, 0, alpha);
    } else {
      fill(255, 0, 0, alpha);
    }

    push();
    translate(this.x0, this.y0);
    rotate(radians(this.angle));
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size);
    pop();
  }
}


function showFireworksGame() {
  background(20);

  // 底部
  if (random() < 0.3) {
    fireParticles.push(new BottomParticle(random(width), height));
  }

  // 更新
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    let p = fireParticles[i];
    p.update();
    p.display();

    // 删除没生命的
    if (p.life <= 0) {
      fireParticles.splice(i, 1);
    }
  }

  // 粒子总数
  if (fireParticles.length > 500) {
    fireParticles.splice(0, 1);
  }
}

// 扎染

class Wave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = 200;
  }

  update() {
    this.life++;
  }

  isDead() {
    return this.life > this.maxLife;
  }

  display() {
    let x1 = this.x + this.life % 70;
    let y1 = this.y + this.life % 70;
    let x2 = this.x - this.life % 90;
    let y2 = this.y + this.life % 90;
    let x3 = this.x - this.life % 80;
    let y3 = this.y - this.life % 80;
    let x4 = this.x + this.life % 100;
    let y4 = this.y - this.life % 100;

    let alpha = map(this.life, 0, this.maxLife, 255, 0);

    push();
    translate(this.x, this.y);
    rotate(noise(this.life * 0.01));
    translate(-this.x, -this.y);

    noFill();
    for (let i = 0; i < 5; i++) {
      stroke(0, 145, 192, (60 - i * 10) * alpha / 255);
      strokeWeight(1 + i);
      beginShape();
      curveVertex(x1, y1);
      curveVertex(x1, y1);
      curveVertex(x2, y2);
      curveVertex(x3, y3);
      curveVertex(x4, y4);
      curveVertex(x1, y1);
      curveVertex(x1, y1);
      endShape();
    }

    noStroke();
    for (let size = 20; size > 8; size -= 4) {
      let a = map(size, 20, 8, 10, 150) * alpha / 255;
      fill(0, 145, 192, a);
      circle(this.x, this.y, size);
    }

    pop();
  }
}


function showWaveGame() {
  background(250, 248, 245, 30);

  for (let i = waves.length - 1; i >= 0; i--) {
    waves[i].update();
    waves[i].display();
    if (waves[i].isDead()) {
      waves.splice(i, 1);
    }
  }

}

// ————————————————

function setup() {
  createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  character = new Character(25, 125);
  gameMap = new GameMap();
  textFont('Comic Sans MS');
}

function draw() {
  if (currentScreen == 'map') {
    // 地图
    background(39, 78, 19);
    gameMap.display();

    // 移动人
    if (keyIsDown(LEFT_ARROW)) {
      character.move(-character.speed, 0);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      character.move(character.speed, 0);
    }
    if (keyIsDown(UP_ARROW)) {
      character.move(0, -character.speed);
    }
    if (keyIsDown(DOWN_ARROW)) {
      character.move(0, character.speed);
    }

    // 人
    character.display();

    // 检查旗子
    let flagNum = character.checkFlag();
    if (flagNum > 0) {
      fill(255);
      textSize(20);
      if (flagNum == 1) {
        text("Press Space: Iron Blossom", 80, 80);
      } else if (flagNum == 2) {
        text("Press Space: Indigo Dyeing", 380, 230);
      } else if (flagNum == 3) {
        text("Press Space: Unknown", 600, 330);
      }
    }

    // title
    noStroke();
    fill(255, 217, 102);
    textSize(50);
    text("ICH Footsteps", width / 2 - 160, 60);

  } else if (currentScreen == 'fireworks') {
    showFireworksGame();

  } else if (currentScreen == 'waves') {
    showWaveGame();
  }
}


function keyPressed() {
  if (key == ' ') {
    if (currentScreen == 'map') {
      let flagNum = character.checkFlag();
      if (flagNum == 1) {
        currentScreen = 'fireworks';
        currentFlag = flagNum;
        fireParticles = [];
      } else if (flagNum == 2) {
        currentScreen = 'waves';
        currentFlag = flagNum;
        waves = [];
      }
    } else {
      currentScreen = 'map';
      currentFlag = 0;
    }
  }
}


function mousePressed() {
  if (currentScreen == 'fireworks') {
    // 生成旋转粒子
    for (let i = 0; i < 15; i++) {
      fireParticles.push(new RotateParticle(mouseX, mouseY));
    }
  } else if (currentScreen == 'waves') {
    // 生成波纹
    waves.push(new Wave(mouseX, mouseY));
  }
}