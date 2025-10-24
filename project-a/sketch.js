let sad = 0;
let HX, HY, SX, SY, SP;
let gameState = "start";
let colorChangeFrame = 0;
let monsterColorR = 255;
let monsterColorG = 255;
let monsterColorB = 255;
let moveCount = 0;
let movingRight = true;
let startX;
let finalMonsterX;
let finalMonsterY;
let monsterSpeedX = 2;
let monsterSpeedY = 2;
let playerX;
let playerY;
let playerSpeed = 20;
let hitCount = 0;
let bulletRound = 0;
let shootTimer = 0;
let shootInterval = 180;
let isLevelUp = false;
let levelUpTimer = 0;
let s = 200;
let emo = true;
let moveSad = false;
let isUpDownActive = false;
let isFloatingActive = false;
let clickCounter = 0;
let pulsateCount = 0;
let isPulsating = false;
let lastPulseCheck = 0;

// 拖尾位置变量
let trail1_rotation = 0;
let trail2_rotation = 0;
let trail3_rotation = 0;

// bullets
let b1x, b1y, b1angle, b1dist, b1active;
let b2x, b2y, b2angle, b2dist, b2active;
let b3x, b3y, b3angle, b3dist, b3active;
let b4x, b4y, b4angle, b4dist, b4active;
let b5x, b5y, b5angle, b5dist, b5active;
let b6x, b6y, b6angle, b6dist, b6active;
let b7x, b7y, b7angle, b7dist, b7active;
let b8x, b8y, b8angle, b8dist, b8active;
let b9x, b9y, b9angle, b9dist, b9active;
let b10x, b10y, b10angle, b10dist, b10active;

function setup() {
  let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
  HX = width / 2;
  HY = height / 2;
  SX = width / 2;
  SY = height / 2;
  startX = width / 2;
  SP = 2;
  finalMonsterX = width / 2;
  finalMonsterY = height / 2 - 50;
  playerX = width / 2;
  playerY = height / 2 + 100;
  clearAllBullets();
}

function draw() {
  if (gameState === 'start') {
    StartPage();
  } else if (gameState === 'playing') {
    Playwiththemonster();
    
    // 处理跳动效果
    if (isPulsating) {
      let currentSin = sin(frameCount * 0.5);
      let lastSin = sin((frameCount - 1) * 0.5);
      
      if (lastSin < 0 && currentSin >= 0) {
        pulsateCount++;
        if (pulsateCount >= 4) {
          isPulsating = false;
          pulsateCount = 0;
          clickCounter = 0;
          emo = true;
        }
      }
      
      s = map(sin(frameCount * 0.5), -1, 1, 180, 220);
      emo = false;
    } else {
      s = 200;
      emo = true;
    }
    
    // 根据动画状态显示不同效果
    if (isUpDownActive) {
      updown();
    } else if (isFloatingActive) {
      Floating();
    } else {
      MonsterMovements();
    }
    
    colorChangeFrame++;
    if (colorChangeFrame >= 60) {
      colorChangeFrame = 0;
      monsterColorR = random(255);
      monsterColorG = random(255);
      monsterColorB = random(255);
    }
  } else if (gameState === "instruction") {
    InstructionPage();
  } else if (gameState === "final") {
    FinalStage();

    monsterColorR = 208;
    monsterColorG = 224;
    monsterColorB = 227;

    // 移动怪物
    finalMonsterX += monsterSpeedX;
    finalMonsterY += monsterSpeedY;
    if (finalMonsterX > width - 100 || finalMonsterX < 100) {
      monsterSpeedX *= -1;
    }
    if (finalMonsterY > height - 100 || finalMonsterY < 150) {
      monsterSpeedY *= -1;
    }
    
    // 绘制monster
    drawCreature_happy(finalMonsterX, finalMonsterY, 120, true);
    
    // 绘制player
    player(playerX, playerY);
    
    // 子弹逻辑
    shootTimer++;
    if (shootTimer >= shootInterval && bulletRound < 20) {
      shootBullets();
      bulletRound++;
      shootTimer = 0;
      if (bulletRound === 10) {
        isLevelUp = true;
        gameState = "levelup";
        levelUpTimer = 0;
        clearAllBullets();
      }
    }
    updateBullets();
    checkCollisions();

    fill(255, 217, 102);
    textSize(20);
    text("Hits: " + hitCount + "/5", 20, 30);
    text("Round: " + bulletRound + "/20", 20, 60);
    
  } else if (gameState === "levelup") {
    FinalStage();
    fill(255, 217, 102);
    textSize(70);
    textFont("Comic Sans MS");
    text("LEVEL UP!", width / 2 - 180, height / 2);
    levelUpTimer++;
    if (levelUpTimer >= 120) {
      gameState = "final";
      shootInterval = 60;
      levelUpTimer = 0;
    }
  } else if (gameState === "win") {
    FinalStageWin();
  } else if (gameState === "lose") {
    FinalStageLose();
  }
}

// creature 绕中心旋转（带拖尾效果）
function updown() {
  push();
  translate(width / 2, height / 2);
  scale(0.6);
  translate(-width / 2, -height / 2);
  
  let centerX = width / 2;
  let centerY = height / 2;
  let rotationAngle = frameCount * 0.03;
  
  // 更新拖尾旋转角度
  trail3_rotation = trail2_rotation;
  trail2_rotation = trail1_rotation;
  trail1_rotation = rotationAngle;
  
  // 绘制拖尾 3（最淡）
  if (frameCount > 2) {
    for (let angle = 0; angle < TWO_PI; angle += PI / 6) {
      push();
      let r = 120;
      let x = centerX + r * cos(angle + trail3_rotation);
      let y = centerY + r * sin(angle + trail3_rotation);
      translate(x, y);
      rotate(-trail3_rotation);
      drawCreatureWithAlpha(0, 0, 80, true, 80);
      pop();
    }
  }
  
  // 绘制拖尾 2（中等透明度）
  if (frameCount > 1) {
    for (let angle = 0; angle < TWO_PI; angle += PI / 6) {
      push();
      let r = 120;
      let x = centerX + r * cos(angle + trail2_rotation);
      let y = centerY + r * sin(angle + trail2_rotation);
      translate(x, y);
      rotate(-trail2_rotation);
      drawCreatureWithAlpha(0, 0, 80, true, 140);
      pop();
    }
  }
  
  // 绘制拖尾 1（较不透明）
  if (frameCount > 0) {
    for (let angle = 0; angle < TWO_PI; angle += PI / 6) {
      push();
      let r = 120;
      let x = centerX + r * cos(angle + trail1_rotation);
      let y = centerY + r * sin(angle + trail1_rotation);
      translate(x, y);
      rotate(-trail1_rotation);
      drawCreatureWithAlpha(0, 0, 80, true, 180);
      pop();
    }
  }
  
  // 绘制当前位置的 creatures（完全不透明）
  for (let angle = 0; angle < TWO_PI; angle += PI / 6) {
    push();
    let r = 120;
    let x = centerX + r * cos(angle + rotationAngle);
    let y = centerY + r * sin(angle + rotationAngle);
    translate(x, y);
    rotate(-rotationAngle);
    drawCreature_happy(0, 0, 80, true);
    pop();
  }
  
  pop();
}

// creature 左右漂浮摆动
function Floating() {
  push();
  translate(width / 2, height / 2);
  scale(0.6);
  translate(-width / 2, -height / 2);
  
  let floatX = width / 2 + sin(frameCount * 0.05) * 100;
  let floatY = height / 2 + sin(frameCount * 0.02) * 10;
  
  push();
  translate(floatX, floatY);
  rotate(map(sin(frameCount * 0.05), -1, 1, -PI / 8, PI / 8));
  translate(-floatX, -floatY);
  drawCreature_happy(floatX, floatY, s, true);
  pop();
  
  pop();
}

function keyPressed() {
  if (key === " " && gameState === "playing") gameState = "instruction";
  else if (key === " " && gameState === "instruction") {
    gameState = "final";
    bulletRound = 0;
    hitCount = 0;
    shootTimer = 0;
    clearAllBullets();
  }
  
  // 在 playing 界面切换动画
  if (gameState === "playing") {
    if (keyCode === UP_ARROW) {
      isUpDownActive = !isUpDownActive;
      if (isUpDownActive) {
        isFloatingActive = false;
        trail1_rotation = 0;
        trail2_rotation = 0;
        trail3_rotation = 0;
      }
    }
    if (keyCode === DOWN_ARROW) {
      isFloatingActive = !isFloatingActive;
      if (isFloatingActive) {
        isUpDownActive = false;
      }
    }
  }

  // Player 移动
  if (gameState === "final") {
    if (key === "w" || key === "W") playerY = max(30, playerY - playerSpeed);
    if (key === "s" || key === "S") playerY = min(height - 30, playerY + playerSpeed);
    if (key === "a" || key === "A") playerX = max(30, playerX - playerSpeed);
    if (key === "d" || key === "D") playerX = min(width - 30, playerX + playerSpeed);
  }
}

function clearAllBullets() {
  b1active = b2active = b3active = b4active = b5active = b6active = b7active = b8active = b9active = b10active = false;
}

function shootBullets() {
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, 2 * PI);

    if (i === 0) {
      b1x = finalMonsterX; b1y = finalMonsterY; b1angle = angle; b1dist = 0; b1active = true;
    } else if (i === 1) {
      b2x = finalMonsterX; b2y = finalMonsterY; b2angle = angle; b2dist = 0; b2active = true;
    } else if (i === 2) {
      b3x = finalMonsterX; b3y = finalMonsterY; b3angle = angle; b3dist = 0; b3active = true;
    } else if (i === 3) {
      b4x = finalMonsterX; b4y = finalMonsterY; b4angle = angle; b4dist = 0; b4active = true;
    } else if (i === 4) {
      b5x = finalMonsterX; b5y = finalMonsterY; b5angle = angle; b5dist = 0; b5active = true;
    } else if (i === 5) {
      b6x = finalMonsterX; b6y = finalMonsterY; b6angle = angle; b6dist = 0; b6active = true;
    } else if (i === 6) {
      b7x = finalMonsterX; b7y = finalMonsterY; b7angle = angle; b7dist = 0; b7active = true;
    } else if (i === 7) {
      b8x = finalMonsterX; b8y = finalMonsterY; b8angle = angle; b8dist = 0; b8active = true;
    } else if (i === 8) {
      b9x = finalMonsterX; b9y = finalMonsterY; b9angle = angle; b9dist = 0; b9active = true;
    } else if (i === 9) {
      b10x = finalMonsterX; b10y = finalMonsterY; b10angle = angle; b10dist = 0; b10active = true;
    }
  }
}

function updateBullets() {
  if (b1active) {
    b1dist += 2;
    b1x = b1dist * cos(b1angle) + finalMonsterX;
    b1y = b1dist * sin(b1angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b1x, b1y, 10);
    if (b1x < 0 || b1x > width || b1y < 0 || b1y > height) b1active = false;
  }
  if (b2active) {
    b2dist += 2;
    b2x = b2dist * cos(b2angle) + finalMonsterX;
    b2y = b2dist * sin(b2angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b2x, b2y, 10);
    if (b2x < 0 || b2x > width || b2y < 0 || b2y > height) b2active = false;
  }
  if (b3active) {
    b3dist += 2;
    b3x = b3dist * cos(b3angle) + finalMonsterX;
    b3y = b3dist * sin(b3angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b3x, b3y, 10);
    if (b3x < 0 || b3x > width || b3y < 0 || b3y > height) b3active = false;
  }
  if (b4active) {
    b4dist += 2;
    b4x = b4dist * cos(b4angle) + finalMonsterX;
    b4y = b4dist * sin(b4angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b4x, b4y, 10);
    if (b4x < 0 || b4x > width || b4y < 0 || b4y > height) b4active = false;
  }
  if (b5active) {
    b5dist += 2;
    b5x = b5dist * cos(b5angle) + finalMonsterX;
    b5y = b5dist * sin(b5angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b5x, b5y, 10);
    if (b5x < 0 || b5x > width || b5y < 0 || b5y > height) b5active = false;
  }
  if (b6active) {
    b6dist += 2;
    b6x = b6dist * cos(b6angle) + finalMonsterX;
    b6y = b6dist * sin(b6angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b6x, b6y, 10);
    if (b6x < 0 || b6x > width || b6y < 0 || b6y > height) b6active = false;
  }
  if (b7active) {
    b7dist += 2;
    b7x = b7dist * cos(b7angle) + finalMonsterX;
    b7y = b7dist * sin(b7angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b7x, b7y, 10);
    if (b7x < 0 || b7x > width || b7y < 0 || b7y > height) b7active = false;
  }
  if (b8active) {
    b8dist += 2;
    b8x = b8dist * cos(b8angle) + finalMonsterX;
    b8y = b8dist * sin(b8angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b8x, b8y, 10);
    if (b8x < 0 || b8x > width || b8y < 0 || b8y > height) b8active = false;
  }
  if (b9active) {
    b9dist += 2;
    b9x = b9dist * cos(b9angle) + finalMonsterX;
    b9y = b9dist * sin(b9angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b9x, b9y, 10);
    if (b9x < 0 || b9x > width || b9y < 0 || b9y > height) b9active = false;
  }
  if (b10active) {
    b10dist += 2;
    b10x = b10dist * cos(b10angle) + finalMonsterX;
    b10y = b10dist * sin(b10angle) + finalMonsterY;
    fill(255, 0, 0);
    noStroke();
    circle(b10x, b10y, 10);
    if (b10x < 0 || b10x > width || b10y < 0 || b10y > height) b10active = false;
  }
}

function checkCollisions() {
  if (b1active && dist(b1x, b1y, playerX, playerY) < 20) {
    b1active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b2active && dist(b2x, b2y, playerX, playerY) < 20) {
    b2active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b3active && dist(b3x, b3y, playerX, playerY) < 20) {
    b3active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b4active && dist(b4x, b4y, playerX, playerY) < 20) {
    b4active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b5active && dist(b5x, b5y, playerX, playerY) < 20) {
    b5active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b6active && dist(b6x, b6y, playerX, playerY) < 20) {
    b6active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b7active && dist(b7x, b7y, playerX, playerY) < 20) {
    b7active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b8active && dist(b8x, b8y, playerX, playerY) < 20) {
    b8active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b9active && dist(b9x, b9y, playerX, playerY) < 20) {
    b9active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }
  if (b10active && dist(b10x, b10y, playerX, playerY) < 20) {
    b10active = false;
    hitCount++;
    if (hitCount >= 5) gameState = "lose";
  }

  let allBulletsInactive = !b1active && !b2active && !b3active && !b4active && !b5active && !b6active && !b7active && !b8active && !b9active && !b10active;
  if (bulletRound >= 20 && allBulletsInactive && hitCount < 5) {
    gameState = "win";
  }
}

function MonsterMovements() {
  push();
  translate(width / 2, height / 2);
  scale(0.6);
  translate(-width / 2, -height / 2);

  if (sad % 2 == 0) {
    drawCreature_happy(HX, HY, s, emo);
    HY = height / 2 + sin(frameCount * 0.05) * 30;
    moveCount = 0;
    SX = startX;
    movingRight = true;
  } else {
    drawCreature_happy(SX, SY, s, emo);
    SX += SP;
    if (SX > startX + 50) {
      SP = -SP;
      moveCount++;
    } else if (SX < startX - 50) {
      SP = -SP;
      moveCount++;
    }
    if (moveCount >= 4) {
      sad++;
      moveCount = 0;
      SX = startX;
    }
  }
  pop();
}

function mousePressed() {
  if (gameState === "start") {
    if (mouseX > width / 2 + 20 - 150 && mouseX < width / 2 + 20 + 150 && mouseY > 300 - 25 && mouseY < 300 + 25) {
      gameState = "playing";
    }
  } else if (gameState === "playing") {
    clickCounter++;
    if (clickCounter >= 5) {
      isPulsating = true;
      pulsateCount = 0;
    } else {
      sad += 1;
    }
  }
}

function drawCreature_happy(x, y, size, isHappy) {
  push();
  push();
  translate(x, y);
  noFill();
  stroke(monsterColorR, monsterColorG, monsterColorB);
  beginShape();
  let lineLength = size * 1.3;
  for (let i = size * 0.1; i <= lineLength; i += lineLength / 20) {
    let v = -size * 0.2 + size * 0.1 * sin(frameCount * 0.1 - i / (size * 0.1));
    vertex(i, v + size * 0.5);
    vertex(i - size * 0.12, v + size * 0.5);
    vertex(i + size * 0.08, v + size * 0.6);
  }
  endShape();
  beginShape();
  for (let i = size * 0.1; i <= lineLength; i += lineLength / 20) {
    let v = -size * 0.2 + size * 0.1 * sin(frameCount * 0.1 - i / (size * 0.1));
    vertex(i, v + size * 0.5);
    vertex(i, v + size * 0.6);
  }
  endShape();
  pop();
  fill(monsterColorR, monsterColorG, monsterColorB);
  noStroke();
  circle(x, y, size * 1.65);
  push();
  translate(x, y);
  fill(monsterColorR, monsterColorG, monsterColorB);
  noStroke();
  for (let angle = 0; angle < 2 * PI; angle += PI / 5) {
    push();
    rotate(angle);
    circle(size * 0.825, 0, size * 0.3);
    pop();
  }
  pop();
  if (isHappy) {
    Happy(x, y, size);
  } else {
    Sad(x, y, size);
  }
  pop();
}

function Happy(x, y, s) {
  fill(0);
  circle(x - s * 0.2, y, s * 0.05);
  circle(x + s * 0.2, y, s * 0.05);
  noFill();
  stroke(0);
  arc(x, y + s * 0.1, s * 0.1, s * 0.1, 0, PI);
}

function Sad(x, y, s) {
  fill(0);
  circle(x - s * 0.2, y, s * 0.05);
  circle(x + s * 0.2, y, s * 0.05);
  noFill();
  stroke(0);
  arc(x, y + s * 0.1, s * 0.1, s * 0.1, PI, 0);
}

function drawCreatureWithAlpha(x, y, size, isHappy, alpha) {
  push();
  push();
  translate(x, y);
  noFill();
  stroke(monsterColorR, monsterColorG, monsterColorB, alpha);
  beginShape();
  let lineLength = size * 1.3;
  for (let i = size * 0.1; i <= lineLength; i += lineLength / 20) {
    let v = -size * 0.2 + size * 0.1 * sin(frameCount * 0.1 - i / (size * 0.1));
    vertex(i, v + size * 0.5);
    vertex(i - size * 0.12, v + size * 0.5);
    vertex(i + size * 0.08, v + size * 0.6);
  }
  endShape();
  beginShape();
  for (let i = size * 0.1; i <= lineLength; i += lineLength / 20) {
    let v = -size * 0.2 + size * 0.1 * sin(frameCount * 0.1 - i / (size * 0.1));
    vertex(i, v + size * 0.5);
    vertex(i, v + size * 0.6);
  }
  endShape();
  pop();
  fill(monsterColorR, monsterColorG, monsterColorB, alpha);
  noStroke();
  circle(x, y, size * 1.65);
  push();
  translate(x, y);
  fill(monsterColorR, monsterColorG, monsterColorB, alpha);
  noStroke();
  for (let angle = 0; angle < 2 * PI; angle += PI / 5) {
    push();
    rotate(angle);
    circle(size * 0.825, 0, size * 0.3);
    pop();
  }
  pop();
  fill(0, alpha);
  circle(x - size * 0.2, y, size * 0.05);
  circle(x + size * 0.2, y, size * 0.05);
  noFill();
  stroke(0, alpha);
  if (isHappy) {
    arc(x, y + size * 0.1, size * 0.1, size * 0.1, 0, PI);
  } else {
    arc(x, y + size * 0.1, size * 0.1, size * 0.1, PI, 0);
  }
  pop();
}

function Playwiththemonster() {
  background(217, 234, 211);
  randomSeed(floor(frameCount / 60));
  rectMode(CENTER);
  noStroke();
  for (let i = 50; i < 1000; i += 100) {
    let h = random(300);
    fill(random(255), random(255), random(255));
    rect(i, 500, 50, h);
  }
  stroke(246, 178, 107);
  fill(246, 178, 107);
  textSize(50);
  textFont("Comic Sans MS");
  text("Play with the Monster~", width / 2 - 250, 100);
  textSize(20);
  fill(100);
  noStroke();
  if (isPulsating) {
    text("Pulsating! (" + pulsateCount + "/4)", width / 2 - 80, height - 90);
  } else {
    text("Clicks: " + clickCounter + "/5", width / 2 - 60, height - 90);
  }
  if (isUpDownActive) {
    text("Animation: Rotation (↑ to toggle)", width / 2 - 140, height - 60);
  } else if (isFloatingActive) {
    text("Animation: Floating (↓ to toggle)", width / 2 - 140, height - 60);
  } else {
    text("Press ↑ for Rotation / ↓ for Floating", width / 2 - 160, height - 60);
  }
  text("Press SPACE to continue", width / 2 - 120, height - 30);
}

function StartPage() {
  background(255, 229, 153);
  stroke(5);
  fill(118, 165, 175);
  textSize(50);
  textFont("Comic Sans MS");
  text("Let's Defeat the", width / 2 - 190, 100);
  stroke(5);
  fill(142, 124, 195);
  textSize(70);
  text("Chewy Bubble Gum", width / 2 - 320, 200);
  stroke(5);
  fill(159, 174, 207);
  rectMode(CENTER);
  rect(width / 2 + 20, 300, 300, 50);
  textSize(30);
  text("START", width / 2 - 35, 300 + 9);
}

function FinalStage() {
  background(0);
  noFill();
  noStroke();
  fill(255, 217, 102);
  textSize(50);
  textFont("Comic Sans MS");
  text("Final Stage", width / 2 - 110, 100);
}

function InstructionPage() {
  background(50, 50, 80);
  fill(255, 217, 102);
  textSize(60);
  textFont("Comic Sans MS");
  text("Game Rules", width / 2 - 140, 80);
  fill(255);
  textSize(22);
  textAlign(LEFT);
  text("• Dodge the bullets fired by the monster!", 100, 160);
  text("• Use WASD keys to move your player", 100, 200);
  text("• First 10 rounds: Bullets every 3 seconds", 100, 240);
  text("• After LEVEL UP: Bullets every 1 second", 100, 280);
  text("• Get hit 5 times = LOSE", 100, 320);
  text("• Survive all 20 rounds = WIN", 100, 360);
  textAlign(CENTER);
  textSize(25);
  fill(255, 217, 102);
  text("Press SPACE to continue", width / 2, height - 80);
  textAlign(LEFT);
}

function FinalStageWin() {
  background(0);
  noFill();
  stroke(255);
  let size = 250;
  circle(width / 2, height / 2, size);
  fill(255);
  circle(width / 2 - 30, height / 2, 6);
  circle(width / 2 + 30, height / 2, 6);
  noFill();
  arc(width / 2, height / 2 + 10, 10, 10, 0, PI);
  noStroke();
  fill(255, 217, 102);
  textSize(50);
  textFont("Comic Sans MS");
  text("YOU WIN!", width / 2 - 110, height - 50);
}

function FinalStageLose() {
  background(0);
  noFill();
  stroke(255);
  let size = 250;
  circle(width / 2, height / 2, size);
  fill(255);
  circle(width / 2 - 30, height / 2, 6);
  circle(width / 2 + 30, height / 2, 6);
  noFill();
  arc(width / 2, height / 2 + 10, 10, 10, PI, 0);
  noStroke();
  fill(255, 217, 102);
  textSize(50);
  textFont("Comic Sans MS");
  text("YOU LOSE!", width / 2 - 120, height - 50);
}

function player(x, y) {
  fill(255);
  circle(x, y, 30);
  fill(255);
  beginShape();
  vertex(x - 20, y - 20);
  vertex(x - 3, y - 10);
  vertex(x - 15, y);
  endShape(CLOSE);
  beginShape();
  vertex(x + 20, y - 20);
  vertex(x + 3, y - 10);
  vertex(x + 15, y);
  endShape(CLOSE);
}