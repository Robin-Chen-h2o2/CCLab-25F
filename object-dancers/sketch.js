/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new OldMan(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class OldMan {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.s = 40
    this.z = this.x * 0.98;
    this.z1 = this.y * 1.01;
    this.x1 = width / 2;
    this.x2 = height / 2;

  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    this.y = sin(frameCount * 0.1) * 1 + height / 2
    this.x2 = -sin(frameCount * 0.1) * 3 + width / 2
    this.x = sin(frameCount * 0.1) * 8 + width / 2
    this.x1 = sin(frameCount * 0.1) * 4 + height / 2
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    //head+neck
    noStroke()
    fill(240, 216, 202)
    circle(0, 0 - this.s * 0.4, this.s * 0.9)
    rectMode(CENTER);
    rect(0, 0 + this.s * 0.1, this.s * 0.1, this.s * 0.2)
    //hands
    push();
    translate(-this.x, -this.y);
    stroke(940, 216, 202)
    strokeWeight(4);
    line(this.x - this.s * 0.3, this.y + this.s * 0.15, this.x - this.s * 0.8, this.y + this.s * 0.15)
    line(this.x - this.s * 0.8, this.y + this.s * 0.15, this.z - this.s * 0.8, this.z1 + this.s * 0.65)
    line(this.x + this.s * 0.3, this.y + this.s * 0.15, this.x + this.s * 0.8, this.y + this.s * 0.15)
    line(this.x + this.s * 0.8, this.y + this.s * 0.15, this.z + this.s * 0.8, this.z1 + this.s * 0.65)
    //legs
    line(this.z - this.s * 0.2, this.z1 + this.s, this.x - this.s * 0.5, this.y + this.s * 1.3);
    line(this.x - this.s * 0.5, this.y + this.s * 1.3, this.z - this.s * 0.5, this.z1 + this.s * 1.6);
    line(this.z + this.s * 0.2, this.z1 + this.s, this.x2 + this.s * 0.5, this.y + this.s * 1.3);
    line(this.x2 + this.s * 0.5, this.y + this.s * 1.3, this.z + this.s * 0.5, this.z1 + this.s * 1.6)
    //clothes
    noStroke()
    fill(233, 215, 192)
    //rect(x,y+s*0.6,s*0.6,s*0.96)
    beginShape()
    vertex(this.x - this.s * 0.3, this.y + this.s * 0.1)
    vertex(this.x + this.s * 0.3, this.y + this.s * 0.1)
    vertex(this.z + this.s * 0.3, this.z1 + this.s * 0.96)
    vertex(this.z - this.s * 0.3, this.z1 + this.s * 1)
    endShape(CLOSE)
    //baojie

    fill(255, 130, 0)
    stroke(255, 130, 0)
    strokeWeight(1)
    beginShape();
    vertex(this.x - this.s * 0.3, this.y + this.s * 0.13)
    vertex(this.x - this.s * 0.16, this.y + this.s * 0.13)
    vertex(this.x - this.s * 0.05, this.y + this.s * 0.4)
    vertex(this.z - this.s * 0.05, this.z1 + this.s * 1)
    vertex(this.z - this.s * 0.3, this.z1 + this.s)
    endShape(CLOSE)
    beginShape()
    vertex(this.x + this.s * 0.3, this.y + this.s * 0.13)
    vertex(this.x + this.s * 0.16, this.y + this.s * 0.13)
    vertex(this.x + this.s * 0.05, this.y + this.s * 0.4)
    vertex(this.z + this.s * 0.05, this.z1 + this.s * 1)
    vertex(this.z + this.s * 0.3, this.z1 + this.s)
    endShape(CLOSE);
    //green

    stroke(166, 255, 0);
    strokeWeight(3)
    fill(255, 232, 0)
    rectMode(CENTER);
    rect(this.x1 * 0.72 + this.s * 0.16, this.y + this.s * 0.7, this.s * 0.23, this.s * 0.1)
    rect(this.x1 * 0.72 - this.s * 0.16, this.y + this.s * 0.7, this.s * 0.23, this.s * 0.1)

    pop();



    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.

    //rectMode(CORNER);
    //this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}




// /*
// GOAL:
// The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

// RULES:
// For this to work you need to follow one rule: 
//   - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
//   - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
//   - Your dancer will always be initialized receiving two arguments: 
//     - startX (currently the horizontal center of the canvas)
//     - startY (currently the vertical center of the canvas)
//   beside these, please don't add more parameters into the constructor function 
//   - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 