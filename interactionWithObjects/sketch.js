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
} //neg negeer gargaj ireh

function draw() {
  background(220);
  // if (mouseIsPressed) {
  //   rain.push(new Rain(mouseX, mouseY));
  //   // noFill();
  //   // circle(mouseX, mouseY, 50);
  // }
  // while (rain.length > 30) {
  //   rain.splice(0, 1);
  // }
  for (let i = rain.length - 1; i >= 0; i--) {
    if (rain[i].isOut() == true) {
      rain.splice(i, 1);
    }
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
        if (c[i].isRaining == true) {
          rain.push(new Rain(c[i].x, c[i].y), c[i].h);
        }
      }
    }
    c[i].display();
    c[i].move();
    // c[i].moveback();x` //butsaj ireh
    if (c[i].isOut() == true) {
      c.splice(i, 1);
    }

  }
}