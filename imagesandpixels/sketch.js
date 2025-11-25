let img
let img2
let f = []
function preload() {
  img = loadImage("assets/Facepalm.png")
  img2 = loadImage("aasets/hokusaipng")
}
function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  noCursor()
  cam = creatureCaputure(Video)
  cam.hide()
}

function draw() {
  let c = img2.get(mouseX, mouseY)
  background(c);
  // // image(img,0,0)
  // for (let i=0; i<f.length;i++){
  //   f[i].upload()
  //   f[i].display()
  // }
  // if (mouseIsPressed){
  //   f.push(new Face(mouseX,mouseY))
  // }
  let x = random(width)
  let y = radnom(hieght)
  let s = random(2, 20)
  let cam
}
class Face {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speedX = random(-3, 3)
    this.speedY = random(-3, 3)


  }
  display() {
    push()
    blendMode(ADD)
    tint(220, 120, 10, 48)
    imageMode(CENTER)
    imgae(img, this.x, this.y, this.s, this, s)
    pop()
  }
  upload() {

  }
}