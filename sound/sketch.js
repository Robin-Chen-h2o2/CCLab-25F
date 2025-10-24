let mySound;
let Sound2
let x = 200
let speedX = 5;
function preload() {
  mySound = loadSound("assets/beat.mp3");
  Sound2 = loadSound("assets/kick.mp3")
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("p5-canvas-container");
  mySound.play();
}

function draw() {
  background(220);
  fill(0)
  let f = map(mouseX, 0, height, 1, 3)
  circle(x, height / 2, 50)
  x = speedX * f + x
  if (x < 25) {
    speedX = -speedX
    mySound.play()
  }
  if (x > width - 25) {
    speedX = -speedX
    Sound2.play()
  }
}

// function mousePressed() {
//   if (mySound.isPlaying() == false) {
//     mySound.play();
//   } else {
//     mySound.pause();
//   }
// }