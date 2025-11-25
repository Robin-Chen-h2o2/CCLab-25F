let rain = [];
let c = [];
let n = 3;
let mic;
let sound;

function preload() {
  sound = loadSound("assets/thunder.mp3");
}

function setup() {
  colorMode(HSB, 100);
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  mic = new p5.AudioIn();
  mic.start();
}
function mousePressed() {
  c.push(new Cloud(mouseX, mouseY, random(50, 100)));
}
function draw() {
  background(220);
  // while (rain.length > 30) {
  //   rain.splice(0, 1);
  // }
  for (let i = rain.length - 1; i >= 0; i--) {
    if (rain[i].isOutCanvas()) {
      rain.splice(i, 1);
    }
  }

  if (mouseIsPressed) {
    //rain += [new Rain(mouseX, mouseY)];
    rain.push(new Rain(mouseX, mouseY));
  }
  for (let i = 0; i < rain.length; i++) {
    rain[i].update();
    rain[i].display();
  }
  console.log(rain.length);

  for (let i = 0; i < c.length; i++) {
    for (let j = 0; j < c.length; j++) {
      if (i != j) {
        c[i].checkCollision(c[j]);
      }
    }
    c[i].display();
    c[i].move();
    //c[i].moveback();
    if (c[i].isOut()) {
      c.splice(i, 1);
    }

  }
}

class Rain {
  constructor(x, y) {
    this.x = x + random(-30, 30);
    this.y = y;
  }
  display() {
    strokeWeight(5);
    line(this.x, this.y, this.x, this.y + 5);
  }
  update() {
    this.y += 10;
  }
  isOutCanvas() {
    if (this.y > height + 5) {
      return true;
    } else {
      return false;
    }
  }
}
