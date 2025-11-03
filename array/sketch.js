let x = []
let y = []
let s = []
let speedX = []
function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("p5-canvas-container");
  for (let i = 0; i < x.length; i++) {
    x[i] = random(width);
    y[i] = random(height);
    s[i] = random(50, 150);
    speedX[i] = map(s[i], 50, 150, 3, 0.5);
  }

}
function mousePressed() {
  x.push(mouseX);
  y.push(mouseY);
  s.push(random(50, 150));
  speedX.push(map(100, 50, 150, 3, 0.5))
}
function draw() {
  background(220);
  for (let i = 0; i < x.length; i++) {
    drawCloud(x[i], y[i], s[i])
  }
  move()
}
function drawCloud(x, y, s) {
  fill(255, 230);
  push();
  noStroke();
  translate(x, y);
  //main circle
  circle(0, 0, s);
  //add circles around
  for (let angle = 0; angle < 2 * PI; angle += PI / 5) {
    push();
    rotate(angle);
    let s2 = map(noise(angle), 0, 1, s * 0.1, s)
    circle(s * 0.5, 0, s2);
    pop();
  }
  pop();
}
function move() {
  for (let i = 0; i < x.length; i++) {
    x[i] = x[i] + speedX[i]
    if (x[i] > width + 100) {
      x[i] = random(-width * 0.3, -width);
    }
    y[i] = height * noise(frameCount * 0.003)
  }
}