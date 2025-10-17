let sad = 0;
let HX;
let HY;
let SX;
let SY;
let SP;
let gameState = 'start';
let instructionState = false;
let colorChangeFrame = 0;
let monsterColor = [255, 255, 255];
let moveCount = 0;
let movingRight = true;
let startX;
let finalMonsterX;
let finalMonsterY;
let monsterSpeedX = 2;
let monsterSpeedY = 2;
let bullets = [];
let playerX;
let playerY;
let playerSpeed = 20;
let hitCount = 0;
let bulletRound = 0;
let shootTimer = 0;
let shootInterval = 180; 
let isLevelUp = false;
let levelUpTimer = 0;

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
}

function draw() {
  if (gameState === 'start') {
    StartPage();
  } else if (gameState === 'instruction') {
    InstructionPage();
  } else if (gameState === 'playing') {
    Playwiththemonster();
    MonsterMovements();
    
    colorChangeFrame++;
    if (colorChangeFrame >= 60) {
      colorChangeFrame = 0;
      monsterColor = [random(255), random(255), random(255)];
    }
  } else if (gameState === 'final') {
    FinalStage();
    
    // Move monster randomly
    finalMonsterX += monsterSpeedX;
    finalMonsterY += monsterSpeedY;
    
    // Bounce off walls
    if (finalMonsterX > width - 100 || finalMonsterX < 100) {
      monsterSpeedX = -monsterSpeedX;
    }
    if (finalMonsterY > height - 100 || finalMonsterY < 150) {
      monsterSpeedY = -monsterSpeedY;
    }
    
    // Draw monster
    push();
    translate(finalMonsterX, finalMonsterY);
    scale(0.6);
    translate(-finalMonsterX, -finalMonsterY);
    drawCreature_happy(finalMonsterX, finalMonsterY);
    pop();
    
    // Draw player
    player(playerX, playerY);
    
    // Handle shooting
    shootTimer++;
    if (shootTimer >= shootInterval && bulletRound < 20) {
      shootBullets();
      bulletRound++;
      shootTimer = 0;
      
      // After 10 rounds, level up
      if (bulletRound === 10) {
        isLevelUp = true;
        gameState = 'levelup';
        levelUpTimer = 0;
        bullets = []; // Clear bullets
      }
    }
    
    // Update and draw bullets
    updateBullets();
    
    // Check collisions
    checkCollisions();
    
    // Display hit count
    fill(255, 217, 102);
    textSize(20);
    text('Hits: ' + hitCount + '/5', 20, 30);
    text('Round: ' + bulletRound + '/20', 20, 60);
    
  } else if (gameState === 'levelup') {
    FinalStage();
    fill(255, 217, 102);
    textSize(70);
    textFont('Comic Sans MS');
    text('LEVEL UP!', width/2 - 180, height/2);
    
    levelUpTimer++;
    if (levelUpTimer >= 120) { // 2 seconds pause
      gameState = 'final';
      shootInterval = 60; // Change to 1 second
      levelUpTimer = 0;
    }
  } else if (gameState === 'win') {
    FinalStageWin();
  } else if (gameState === 'lose') {
    FinalStageLose();
  }
}

function keyPressed() {
  // Switch from instruction to final stage when space is pressed
  if (key === ' ' && gameState === 'instruction') {
    gameState = 'final';
    bulletRound = 0;
    hitCount = 0;
    shootTimer = 0;
    bullets = [];
  }
  
  // Switch from playing to instruction when space is pressed
  if (key === ' ' && gameState === 'playing') {
    gameState = 'instruction';
  }
  
  // Player movement (WASD)
  if (gameState === 'final') {
    if (key === 'w' || key === 'W') {
      playerY = max(30, playerY - playerSpeed);
    }
    if (key === 's' || key === 'S') {
      playerY = min(height - 30, playerY + playerSpeed);
    }
    if (key === 'a' || key === 'A') {
      playerX = max(30, playerX - playerSpeed);
    }
    if (key === 'd' || key === 'D') {
      playerX = min(width - 30, playerX + playerSpeed);
    }
  }
}

function shootBullets() {
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, 2 * PI);
    bullets.push({
      x: finalMonsterX,
      y: finalMonsterY,
      angle: angle,
      distance: 0
    });
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.distance += 2;
    b.x = finalMonsterX + b.distance * cos(b.angle);
    b.y = finalMonsterY + b.distance * sin(b.angle);
    
    // Draw bullet
    fill(255, 0, 0);
    noStroke();
    circle(b.x, b.y, 10);
    
    // Remove bullet if off screen
    if (b.x < 0 || b.x > width || b.y < 0 || b.y > height) {
      bullets.splice(i, 1);
    }
  }
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    let d = dist(b.x, b.y, playerX, playerY);
    if (d < 20) { // Collision detected
      bullets.splice(i, 1);
      hitCount++;
      
      // Check lose condition
      if (hitCount >= 5) {
        gameState = 'lose';
      }
    }
  }
  
  // Check win condition
  if (bulletRound >= 20 && bullets.length === 0 && hitCount < 5) {
    gameState = 'win';
  }
}

function MonsterMovements(){
  push();
  translate(width/2, height/2);
  scale(0.6);
  translate(-width/2, -height/2);
  
  if (sad % 2 == 0) {
    drawCreature_happy(HX, HY);
    HY = height / 2 + sin(frameCount * 0.05) * 30;
    moveCount = 0;
    SX = startX;
    movingRight = true;
  } else {
    drawCreature_sad(SX, SY);
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
  if (gameState === 'start') {
    if (mouseX > width/2 + 20 - 150 && mouseX < width/2 + 20 + 150 &&
        mouseY > 300 - 25 && mouseY < 300 + 25) {
      gameState = 'playing';
    }
  } else if (gameState === 'playing') {
    sad += 1;
  }
}

function drawCreature_happy(x, y) {
  push();
  push();
  translate(x, y);
  noFill();
  stroke(0);
  beginShape();
  let lineLength = 240;
  for (let i = 0; i <= lineLength; i += lineLength / 20) {
    let v = 10 * sin(frameCount * 0.1 - i);
    vertex(i, v + 50);
    vertex(i + 10, v + 60);
    vertex(i - 15, v + 50);
  }
  endShape();
  push();
  translate(0, 0);
  noFill();
  beginShape();
  lineLength = 240;
  for (let i = 0; i <= lineLength; i += lineLength / 20) {
    let v = 10 * sin(frameCount * 0.1 - i);
    vertex(i, v + 55);
    vertex(i, v + 60);
  }
  endShape();
  pop();
  pop();
  
  fill(monsterColor[0], monsterColor[1], monsterColor[2]);
  noStroke();
  circle(x, y, 330);
  
  push();
  translate(x, y);
  fill(monsterColor[0], monsterColor[1], monsterColor[2]);
  noStroke();
  for (let angle = 0; angle < 2 * PI; angle += PI / 5) {
    push();
    rotate(angle);
    fill(monsterColor[0], monsterColor[1], monsterColor[2]);
    circle(width / 6, height / 6, 50);
    pop();
  }
  pop();
  
  fill(0);
  circle(x - 50, y, 10);
  circle(x + 50, y, 10);
  noFill();
  stroke(0);
  arc(x, y + 20, 10, 10, 0, PI);
  pop();
}

function drawCreature_sad(x, y) {
  push();
  push();
  translate(x, y);
  noFill();
  stroke(0);
  beginShape();
  let lineLength = 240;
  for (let i = 0; i <= lineLength; i += lineLength / 20) {
    let v = 10 * sin(frameCount * 0.1 - i);
    vertex(i, v + 50);
    vertex(i + 10, v + 60);
    vertex(i - 15, v + 50);
  }
  endShape();
  push();
  translate(0, 0);
  noFill();
  beginShape();
  lineLength = 240;
  for (let i = 0; i <= lineLength; i += lineLength / 20) {
    let v = 10 * sin(frameCount * 0.1 - i);
    vertex(i, v + 55);
    vertex(i, v + 60);
  }
  endShape();
  pop();
  pop();
  
  fill(monsterColor[0], monsterColor[1], monsterColor[2]);
  noStroke();
  circle(x, y, 330);
  
  push();
  translate(x, y);
  fill(monsterColor[0], monsterColor[1], monsterColor[2]);
  noStroke();
  for (let angle = 0; angle < 2 * PI; angle += PI / 5) {
    push();
    rotate(angle);
    fill(monsterColor[0], monsterColor[1], monsterColor[2]);
    circle(width / 6, height / 6, 50);
    pop();
  }
  pop();
  
  fill(0);
  arc(x - 50, y + 10, 15, 10, 0, PI);
  arc(x + 50, y + 10, 15, 10, 0, PI);
  noFill();
  stroke(0);
  arc(x, y + 20, 10, 10, PI, 0);
  pop();
}

function Playwiththemonster(){
  background(217,234,211)
  randomSeed(floor(frameCount / 60));
  rectMode(CENTER)
  for (let i = 50; i< 1000; i+=100){
    let h = random(300);
    fill(random(255), random(255), random(255));
    rect(i, 500, 50, h);
  }
  stroke(246,178,107)
  fill(246,178,107)
  textSize(50)
  textFont('Comic Sans MS')
  text("Play with the Monster~",width/2-250,100)
  textSize(20)
  text("(Try clicking the monster)",width/2+100,140)
  
  // Show instruction - clickable button
  noStroke()
  fill(194,123,160)
  textSize(20);
  text("Press SPACE to continue", width/2-115, height-110);
}

function StartPage(){
  background(255,229,153)
  stroke(5)
  fill(118,165,175)
  textSize(50)
  textFont('Comic Sans MS')
  text("Let's Defeat the",width/2-190,100)
  stroke(5)
  fill(142,124,195)
  textSize(70)
  text("Chewy Bubble Gum",width/2-320,200)
  stroke(5)
  fill(159,174,207)
  rectMode(CENTER)
  rect(width/2+20,300,300,50)
  textSize(30)
  text('START',width/2-35,300+9)
}

function InstructionPage(){
  background(50, 50, 80)
  
  // Title
  fill(255, 217, 102)
  textSize(60)
  textFont('Comic Sans MS')
  text("Game Rules", width/2-140, 80)
  
  // Instructions
  fill(255)
  textSize(22)
  textAlign(LEFT)
  text("• Dodge the bullets fired by the monster!", 100, 160)
  text("• Use WASD keys to move your player", 100, 200)
  text("• First 10 rounds: Bullets every 3 seconds", 100, 240)
  text("• After LEVEL UP: Bullets every 1 second", 100, 280)
  text("• Get hit 5 times = LOSE", 100, 320)
  text("• Survive all 20 rounds = WIN", 100, 360)
  
  // Continue prompt
  textAlign(CENTER)
  textSize(25)
  fill(255, 217, 102)
  text("Press SPACE to continue", width/2, height-80)
  textAlign(LEFT)
}

function FinalStage(){
  background(0)
  noFill()
  noStroke()
  fill(255,217,102)
  textSize(50)
  textFont('Comic Sans MS')
  text("Final Stage",width/2-110,100)
}

function FinalStageWin(){
  background(0)
  noFill()
  stroke(255)
  let size=250
  circle(width/2,height/2,size)
  fill(255)
  circle(width/2-30,height/2,6)
  circle(width/2+30,height/2,6)
  noFill()
  arc(width/2,height/2+10,10,10,0,PI)
  noStroke()
  fill(255,217,102)
  textSize(50)
  textFont('Comic Sans MS')
  text("YOU WIN!",width/2-110,height-50)
}

function FinalStageLose(){
  background(0)
  noFill()
  stroke(255)
  let size=250
  circle(width/2,height/2,size)
  fill(255)
  circle(width/2-30,height/2,6)
  circle(width/2+30,height/2,6)
  noFill()
  arc(width/2,height/2+10,10,10,PI,0)
  noStroke()
  fill(255,217,102)
  textSize(50)
  textFont('Comic Sans MS')
  text("YOU LOSE!",width/2-120,height-50)
}

function player(x,y) {
  fill(255)
  circle(x,y,30)
  fill(255)
  beginShape()
    vertex(x-20,y-20)
    vertex(x-3,y-10)
    vertex(x-15,y)
  endShape(CLOSE)
  beginShape()
    vertex(x+20,y-20)
    vertex(x+3,y-10)
    vertex(x+15,y)
  endShape(CLOSE)
}