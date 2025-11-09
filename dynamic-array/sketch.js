let c = [];
let n = 3;
function preload() {
  sound = loadSund('assets/thunder.mp3')
}

function setup() {
  //createCanvas(400, 400);
  colorMode(HSB, 100);
  let canvas = createCanvas(400, 400);
  canvas.parent("p5-canvas-container");
  mic = new p5.AudioIn()
  mic.start()
  // for (let i = 0; i < n; i++) {
  //   c[i] = new Cloud(random(width), random(height), random(50, 100));
  // }
}
// function mousePressed() {
//   c.push(new Cloud(random(width), random(height), random(50, 100)))
// }

function draw() {
  background(220);
  for (let i = 0; i < c.length; i++) {
    for (let j = 0; j < c.length; j++) {
      if (i != j) {
        c[i].checkCollision(c[j])

      }
      c[i].display();
      c[i].move();
      //c[i].moveback();
      if (c[i].isOut()) {
        c.splice(i, 1);
      }
    }
  }

  console.log(c.length)
  if (mouseIsPressed) {
    c.push(new Cloud(mouseX, mouseY, random(50, 100)))
  }

}
class Cloud {
  //constructor is like the setup
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.y0 = y;
    this.s = s;
    this.speedX = map(this.s, 50, 100, 3, 0.5);
    this.speedY = map(this.s, 50, 100, 0.02, 0.005);
    this.h = random(100);
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
    fill(this.h, 20, 100);
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
    fill(0);
    circle(-this.s * 0.3, 0, this.s * 0.05);
    circle(this.s * 0.3, 0, this.s * 0.05);
    arc(0, 0, this.s * 0.3, this.s * 0.3, 0, PI);
    pop();
  }
  move() {
    let f = map(mic.getLevel(), 0, 1, 1, 20)
    this.x += this.speedX;
    //this.y = this.y0 + this.s * sin(frameCount * this.speedY);
    // this.x = this.x0 + 50 * cos(frameCount * 0.1);
    // this.y = this.y0 + 50 * sin(frameCount * 0.1);
    //this.s = map(sin(frameCount * 0.05), -1, 1, this.s0 * 0.7, this.s0);
    this.y = lerp(this.y, this.y0 + 3000 / this.s * sin(frameCount * this.speedY), 0.1)
  }
  checkCollision(other) {
    let d = dist(this.x, this.y, other.x, other.y)
    if (d < (this.s + other.s) / 2) {
      this.h = random(100)
      if (sound.isPlaying() == false) {
        sound.play()
      }
      sound.play()
    }
  }
  isOut() {
    if (this.x > width + this.s * 2) {
      return true;
    } else {
      return false
    }
  }
  moveback() {
    if (this.x > width + this.s * 2) {
      this.x = random(-width, -width * 0.3);
      this.y = random(height);
      this.y0 = this.y;
      this.s = random(50, 100);
      this.speedX = map(this.s, 50, 100, 3, 0.5);
      this.speedY = map(this.s, 50, 100, 0.02, 0.005);
      this.h = random(100);
    }
  }
}
