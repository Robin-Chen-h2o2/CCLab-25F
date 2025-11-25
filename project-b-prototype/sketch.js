function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
}

class Indigo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    noStroke();
    for (let size = 20; size > 8; size -= 4) {
      let alpha = map(size, 20, 8, 10, 150);
      fill(0, 145, 192, alpha);
      circle(this.x, this.y, size);
    }
  }

  drawCurves() {
    // 4个扩散点
    let x1 = this.x + frameCount % 70;
    let y1 = this.y + frameCount % 70;

    let x2 = this.x - frameCount % 90;
    let y2 = this.y + frameCount % 90;

    let x3 = this.x - frameCount % 80;
    let y3 = this.y - frameCount % 80;

    let x4 = this.x + frameCount % 100;
    let y4 = this.y - frameCount % 100;

    // 多层曲线
    noFill();
    for (let i = 0; i < 5; i++) {
      stroke(0, 145, 192, 60 - i * 10);
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
  }
}

let indigo;

function setup() {
  createCanvas(400, 400);
  indigo = new Indigo(width / 2, height / 2);
}

function draw() {
  background(250, 248, 245, 30);

  push();
  translate(width / 2, height / 2);
  rotate(noise(frameCount * 0.01));
  translate(-width / 2, -height / 2);

  indigo.drawCurves();
  indigo.display();

  pop();
}