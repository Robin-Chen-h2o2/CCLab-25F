let character;
let gameMap;
let currentScreen = 'map';
let currentFlag = 0;
let fireParticles = [];
let waves = [];
let t = 0;
let idleTimer = 0;
let showHint = false;
let nameInput = '';
let nameSounds = [];
let playingIndex = -1;


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

    // head
    noStroke();
    fill(240, 216, 202);
    circle(x, y - s * 0.4, s * 0.9);

    // body
    fill(233, 215, 192);
    rectMode(CENTER);
    rect(x, y + s * 0.4, s * 0.6, s * 0.8);

    // arms
    stroke(240, 216, 202);
    strokeWeight(3);
    line(x - s * 0.3, y + s * 0.2, x - s * 0.6, y + s * 0.4);
    line(x + s * 0.3, y + s * 0.2, x + s * 0.6, y + s * 0.4);

    // legs
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
    // not outside the path
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
    // near flag1?
    if (this.x >= 120 && this.x <= 180 && this.y >= 100 && this.y <= 150) {
      return 1;
    }
    // near flag2?
    if (this.x >= 420 && this.x <= 480 && this.y >= 250 && this.y <= 300) {
      return 2;
    }
    // near flag3?
    if (this.x >= 640 && this.x <= 700 && this.y >= 350 && this.y <= 400) {
      return 3;
    }
    return 0;
  }

  checkEnd() {
    // 检查是否到达地图末端
    if (this.x >= 750 && this.y >= 350 && this.y <= 400) {
      return true;
    }
    return false;
  }
}


class GameMap {
  constructor() { }

  display() {
    // path
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

    // the square under the flags
    fill(192, 180, 142);
    rect(150, 200, 50);
    rect(450, 200, 50);
    rect(670, 300, 50);

    // flags
    this.drawFlag(150, 200, 208, 224, 227);
    this.drawFlag(450, 200, 147, 196, 125);
    this.drawFlag(670, 300, 213, 166, 189);
  }

  drawFlag(x, y, a, b, c) {
    stroke(180, 95, 6);
    strokeWeight(5);
    noFill();
    line(x, y - 50, x, y);
    fill(a, b, c);
    beginShape();
    vertex(x, y - 50);
    vertex(x + 20, y - 40);
    vertex(x, y - 30);
    endShape();
    line(x - 5, y, x + 5, y);
  }
}

// iron blossoms


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

  // 长按鼠标持续生成底部粒子
  if (mouseIsPressed) {
    if (random() < 0.5) {
      fireParticles.push(new BottomParticle(mouseX, mouseY));
    }
    // 有操作，重置计时器
    idleTimer = 0;
    showHint = false;
  }

  // bottom particles
  if (random() < 0.3) {
    fireParticles.push(new BottomParticle(random(width), height));
  }

  // update the particles
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    let p = fireParticles[i];
    p.update();
    p.display();

    // delete particles without life
    if (p.life <= 0) {
      fireParticles.splice(i, 1);
    }
  }

  // restrict total number of the particles
  if (fireParticles.length > 500) {
    fireParticles.splice(0, 1);
  }

  // 显示提示文字
  if (showHint) {
    fill(255, 200);
    textSize(24);
    textAlign(CENTER);
    text("Click to create fireworks", width / 2, height / 2 - 40);
    text("Hold mouse to spray sparks", width / 2, height / 2);
    text("Press SPACE to return", width / 2, height / 2 + 40);
  }
}

// indigo dyeing

// 五声调式游戏
let audioContext;
let pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00]; // C D E G A

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playNote(freq, duration) {
  initAudio();

  let osc = audioContext.createOscillator();
  let gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.frequency.value = freq;
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + duration);
}

function convertNameToNotes(name) {
  let notes = [];
  for (let i = 0; i < name.length; i++) {
    let charCode = name.charCodeAt(i);
    let noteIndex = charCode % 5;
    notes.push(pentatonicScale[noteIndex]);
  }
  return notes;
}

function showPentatonicGame() {
  background(255, 243, 224);

  // 标题
  fill(180, 95, 6);
  textSize(40);
  textAlign(CENTER);
  text("Pentatonic Name Song", width / 2, 80);

  // 说明
  fill(100, 50, 20);
  textSize(20);
  text("Enter your name and hear its melody!", width / 2, 130);

  // 输入框背景
  fill(255);
  stroke(180, 95, 6);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, 200, 400, 50, 10);

  // 输入的名字
  fill(0);
  noStroke();
  textSize(24);
  text(nameInput || "Type your name...", width / 2, 210);

  // 显示音符
  if (nameSounds.length > 0) {
    fill(147, 196, 125);
    textSize(18);
    text("Your melody notes:", width / 2, 270);

    let noteNames = ['C', 'D', 'E', 'G', 'A'];
    let startX = width / 2 - (nameSounds.length * 40) / 2;

    for (let i = 0; i < nameSounds.length; i++) {
      let x = startX + i * 40;
      let y = 320;

      // 音符圆圈
      if (i === playingIndex) {
        fill(255, 200, 0);
        stroke(255, 150, 0);
      } else {
        fill(255);
        stroke(147, 196, 125);
      }
      strokeWeight(3);
      circle(x, y, 35);

      // 音符名称
      fill(0);
      noStroke();
      textSize(20);
      let noteIndex = pentatonicScale.indexOf(nameSounds[i]);
      text(noteNames[noteIndex], x, y + 7);
    }
  }

  // 按钮
  drawButton(width / 2 - 100, 400, "Play", nameSounds.length > 0);
  drawButton(width / 2 + 100, 400, "Clear", nameInput.length > 0);

  // 返回提示
  fill(100);
  textSize(16);
  text("Press SPACE to return to map", width / 2, 470);

  // 显示提示文字
  if (showHint) {
    fill(180, 95, 6, 200);
    textSize(22);
    textAlign(CENTER);
    text("Type your name and click Play", width / 2, height - 50);
  }
}

function drawButton(x, y, label, enabled) {
  rectMode(CENTER);

  if (enabled) {
    if (mouseX > x - 60 && mouseX < x + 60 && mouseY > y - 20 && mouseY < y + 20) {
      fill(255, 217, 102);
      stroke(180, 95, 6);
    } else {
      fill(255, 237, 160);
      stroke(180, 95, 6);
    }
  } else {
    fill(200);
    stroke(150);
  }

  strokeWeight(2);
  rect(x, y, 120, 40, 10);

  fill(enabled ? 0 : 100);
  noStroke();
  textSize(20);
  text(label, x, y + 7);
}

// indigo dyeing

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

  // 显示提示文字
  if (showHint) {
    fill(0, 145, 192);
    textSize(24);
    textAlign(CENTER);
    text("Click to create waves", width / 2, height / 2 - 20);
    text("Press SPACE to return", width / 2, height / 2 + 20);
  }
}

// 彩蛋结局界面
function showEndingScreen() {
  background(213, 166, 189);
  textFont('Comic Sans MS');
  textSize(70);
  textAlign(CENTER);
  text("To Be Continued", width / 2 - 70, height / 2);

  // 三只猫咪的位置
  let startX = width / 2 + 220;
  let y = height / 2 - 20;
  let spacing = 60;

  t += 0.1;

  // 画三只Q版猫咪,每只延迟跳跃
  for (let i = 0; i < 3; i++) {
    let x = startX + i * spacing;
    let jump = abs(sin(t + i * 0.8)) * 20;
    cuteCat(x, y - jump);
  }
}

function cuteCat(x, y) {
  push();
  translate(x, y);

  // 身体
  noStroke();
  fill(255, 180, 120);
  ellipse(0, 0, 20, 22);

  // 头
  ellipse(0, -12, 18, 16);

  // 耳朵
  triangle(-6, -18, -9, -23, -3, -19);
  triangle(6, -18, 9, -23, 3, -19);

  // 眼睛（更大更圆）
  fill(0);
  ellipse(-4, -13, 3, 4);
  ellipse(4, -13, 3, 4);

  // 腮红
  fill(255, 150, 150, 100);
  ellipse(-6, -10, 4, 3);
  ellipse(6, -10, 4, 3);

  // 小嘴巴
  fill(0);
  ellipse(0, -8, 2, 1);

  // 小爪子
  fill(255, 180, 120);
  ellipse(-5, 10, 4, 5);
  ellipse(5, 10, 4, 5);

  // 尾巴
  ellipse(8, 6, 5, 12);

  pop();
}

// ————————————————

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  character = new Character(25, 125);
  gameMap = new GameMap();
  textFont('Comic Sans MS');
}

function draw() {
  // 计时器逻辑
  idleTimer++;
  if (idleTimer > 180) { // 3秒 = 180帧 (60fps)
    showHint = true;
  }

  if (currentScreen == 'map') {
    // map
    background(39, 78, 19);
    gameMap.display();

    // move-character
    if (keyIsDown(LEFT_ARROW)) {
      character.move(-character.speed, 0);
      idleTimer = 0;
      showHint = false;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      character.move(character.speed, 0);
      idleTimer = 0;
      showHint = false;
    }
    if (keyIsDown(UP_ARROW)) {
      character.move(0, -character.speed);
      idleTimer = 0;
      showHint = false;
    }
    if (keyIsDown(DOWN_ARROW)) {
      character.move(0, character.speed);
      idleTimer = 0;
      showHint = false;
    }

    // 检查是否到达终点
    if (character.checkEnd()) {
      currentScreen = 'ending';
      t = 0;
      idleTimer = 0;
      showHint = false;
    }

    // character
    character.display();

    // check flags
    let flagNum = character.checkFlag();
    if (flagNum > 0) {
      fill(255);
      textSize(20);
      if (flagNum == 1) {
        text("Press Space: Iron Blossom", 80, 80);
      } else if (flagNum == 2) {
        text("Press Space: Indigo Dyeing", 380, 230);
      } else if (flagNum == 3) {
        text("Press Space: Pentatonic", 600, 330);
      }
    }

    // title
    noStroke();
    fill(255, 217, 102);
    textSize(50);
    text("ICH Footsteps", width / 2 - 160, 60);

    // 显示提示文字
    if (showHint) {
      fill(255, 230);
      textSize(22);
      textAlign(CENTER);
      text("Use ARROW keys to move", width / 2, height - 80);
      text("Walk to flags and press SPACE to explore", width / 2, height - 50);
    }

  } else if (currentScreen == 'fireworks') {
    showFireworksGame();

  } else if (currentScreen == 'waves') {
    showWaveGame();

  } else if (currentScreen == 'pentatonic') {
    showPentatonicGame();

  } else if (currentScreen == 'ending') {
    showEndingScreen();


  }
}


function keyPressed() {
  // 重置计时器
  idleTimer = 0;
  showHint = false;

  // 五声调式界面输入
  if (currentScreen == 'pentatonic') {
    if (key.length === 1 && nameInput.length < 15) {
      // 只接受字母和数字
      if ((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z') || (key >= '0' && key <= '9')) {
        nameInput += key;
        nameSounds = convertNameToNotes(nameInput);
      }
    } else if (keyCode === BACKSPACE && nameInput.length > 0) {
      nameInput = nameInput.slice(0, -1);
      nameSounds = convertNameToNotes(nameInput);
    }
  }

  if (key == ' ') {
    if (currentScreen == 'map') {
      let flagNum = character.checkFlag();
      if (flagNum == 1) {
        currentScreen = 'fireworks';
        currentFlag = flagNum;
        fireParticles = [];
        idleTimer = 0;
        showHint = false;
      } else if (flagNum == 2) {
        currentScreen = 'waves';
        currentFlag = flagNum;
        waves = [];
        idleTimer = 0;
        showHint = false;
      } else if (flagNum == 3) {
        currentScreen = 'pentatonic';
        currentFlag = flagNum;
        nameInput = '';
        nameSounds = [];
        playingIndex = -1;
        idleTimer = 0;
        showHint = false;
      }
    } else if (currentScreen == 'ending') {
      // 从彩蛋界面返回地图
      currentScreen = 'map';
      currentFlag = 0;
      idleTimer = 0;
      showHint = false;
    } else {
      currentScreen = 'map';
      currentFlag = 0;
      idleTimer = 0;
      showHint = false;
    }
  }
}


function mousePressed() {
  // 重置计时器
  idleTimer = 0;
  showHint = false;

  if (currentScreen == 'fireworks') {
    // generate rotating particles
    for (let i = 0; i < 15; i++) {
      fireParticles.push(new RotateParticle(mouseX, mouseY));
    }
  } else if (currentScreen == 'waves') {
    // generate waves
    waves.push(new Wave(mouseX, mouseY));
  } else if (currentScreen == 'pentatonic') {
    // Play按钮
    if (mouseX > width / 2 - 160 && mouseX < width / 2 - 40 &&
      mouseY > 380 && mouseY < 420 && nameSounds.length > 0) {
      playingIndex = 0;
      playMelody();
    }
    // Clear按钮
    if (mouseX > width / 2 + 40 && mouseX < width / 2 + 160 &&
      mouseY > 380 && mouseY < 420 && nameInput.length > 0) {
      nameInput = '';
      nameSounds = [];
      playingIndex = -1;
    }
  }
}

function playMelody() {
  if (playingIndex < nameSounds.length && playingIndex >= 0) {
    playNote(nameSounds[playingIndex], 0.5);
    playingIndex++;
    setTimeout(() => {
      if (playingIndex < nameSounds.length) {
        playMelody();
      } else {
        playingIndex = -1;
      }
    }, 500);
  }
}