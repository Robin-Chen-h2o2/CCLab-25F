// CCLab Mini Project - 9.R Particle World Template


let NUM_OF_PARTICLES = 100; // Decide the initial number of particles.
let MAX_OF_PARTICLES = 500; // Decide the maximum number of particles.
let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  // generate particles
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(random(width), height);
  }
}

function draw() {
  background(50);

  // consider generating particles in draw(), using Dynamic Array

  if (random() < 0.3) {
    particles.push(new Particle(random(width), height));
  }

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }

  // limit the number of particles
  if (particles.length > 200) {
    particles.splice(0, 1);// remove the first (oldest) particle
  }
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    this.size = random(3, 8);
    this.speedX = random(-2, 2);
    this.speedY = random(-10, -5);// 向上运动
    this.gravity = 0.1;
    this.life = 255;// 生命值
  }
  // methods (functions): particle's behaviors
  update() {
    // 重力
    this.speedY += this.gravity;

    // 更新位置
    this.x += this.speedX;
    this.y += this.speedY;

    // 减少生命值
    this.life -= 2;
  }

  display() {
    // particle's appearance
    // 根据生命值设置透明度
    let alpha = this.life;

    // 热铁颜色：黄到红
    if (this.life > 150) {
      fill(255, 255, 0, alpha); // 黄
    } else if (this.life > 50) {
      fill(255, 100, 0, alpha); // 橙
    } else {
      fill(255, 0, 0, alpha);   // 红
    }

    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.size);
  }
}