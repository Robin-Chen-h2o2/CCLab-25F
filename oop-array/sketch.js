let c = [];
let n = 20;

function setup() {
  //createCanvas(400, 400);
  let canvas = createCanvas(800, 400);
  canvas.parent("p5-canvas-container");
  for (let i = 0; i < n; i++) {
    c[i] = new Cloud(random(-width, -width * 0.1), random(height * 0.2, height * 0.8), random(30, 100));
  }
}

function draw() {
  background(220);
  for (let i = 0; i < n; i++) {
    c[i].display()
    c[i].move()
    c[i].moveback()
  }
}
class Cloud {
  //constructor is like the setup
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.y0 = y
    this.s = s;
    this.speedX = map(this.s, 30, 100, 3, 0.5)
    this.h = random(180)
  }
  //methods are the functions
  display() {
    push();
    translate(this.x, this.y);

    //arm left
    beginShape();
    let lineLength = this.s * 0.5;
    noFill();
    for (let i = -lineLength * 2; i <= lineLength; i += lineLength / 20) {
      strokeWeight(this.s * 0.1);
      let v = this.s * 0.1 * sin(frameCount * 0.1 - i / (this.s * 0.1));
      vertex(i, v);
    }
    endShape();

    //arm right
    push();
    scale(-1, 1);
    beginShape();
    lineLength = this.s * 0.5;
    noFill();
    for (let i = -lineLength * 2; i <= lineLength; i += lineLength / 20) {
      strokeWeight(this.s * 0.1);
      let v = this.s * 0.1 * sin(PI + frameCount * 0.1 - i / (this.s * 0.1));
      vertex(i, v);
    }
    endShape();
    pop();

    //main body
    fill(this.h, this.h, this.h);
    noStroke();
    circle(0, 0, this.s);
    //circles around the body
    for (let a = 0; a < 2 * PI; a += PI / 6) {
      push();
      rotate(a);
      circle(this.s * 0.5, this.s * 0.3, this.s * 0.5);
      pop();
    }
    //face
    fill(255);
    circle(-this.s * 0.3, 0, this.s * 0.05);
    circle(this.s * 0.3, 0, this.s * 0.05);
    arc(0, 0, this.s * 0.3, this.s * 0.3, 0, PI);
    pop();
  }
  move() {
    //this.y = height * noise(frameCount * 0.01);
    this.x = this.x + this.speedX
    this.y = this.y0 + this.s * sin(frameCount * 0.01)
    //this.y = this.y0 + 50 * sin(frameCount * 0.1);
    //this.s = map(sin(frameCount * 0.05), -1, 1, this.s0 * 0.7, this.s0);
  }
  moveback() {
    if (this.x > width + 2 * this.s) {
      this.x = random(-width, -width * 0.1)
      this.y = random(height * 0.2, height * 0.8)
      this.s = random(30, 100)
      this.SpeedX = map(this.s, 30, 100, 3, 0.5)
    }
  }
}