let img;
let cam
let colorToTrack
let t = 10
function preload() {
  img = loadImage("assets/hokusai.jpg")
}
function mousePressed() {
  cam.loadPixels();//very important
  colorToTrack = cam.get(mouseX, mouseY)
}
function setup() {
  let canvas = createCanvas(600, 400, WEBGL);
  canvas.parent("p5-canvas-container");
  cam = createCapture(VIDEO)
  cam.hide()
}
let s = 20
function findColor(input, c) {
  let cr = c[0]
  let cg = c[1]
  let cb = c[2]
  let cx = 0
  let cy = 0
  input.loadPixels()
  for (let x = 0; x < cam.width; x += s) {
    for (let y = 0; y < cam.height; y += s) {
      let i = (y * cam.width + x) * 4
      let r = cam.pixels[i + 0]
      let g = cam.pixels[i + 1]
      let b = cam.pixels[i + 2]
      if (r > cr - t && r < cr + t &&
        g > cg - t && g < cg + t &&
        b > cb - t && b < cb + t
      ) {
        cx = x
        cy = y
        fill(colorToTrack)
        stroke(255)
        circle(cx, cy, 30)
      }
    }
  }

}
function draw() {
  background(0)
  image(cam, 0, 0)
  findColor(cam, colorToTrack)
  //cam.loadPixels();//very important
  // for (let n = 0; n < 100; n++) {
  //   let x = random(cam.width)
  //   let y = random(cam.height)
  //   let s = random(5, 30)
  //   let i = (y * cam.width + x) * 4
  //   let r = cam.pixels[i + 0]
  //   let g = cam.pixels[i + 1]
  //   let b = cam.pixels[i + 2]
  //   fill(r, g, b)
  //   noStroke()
  //   circle(x, y, s)
  // // }

  // for (let x = 0; x < cam.width; x += s) {
  //   for (let y = 0; y < cam.height; y += s) {
  //     let i = (y * cam.width + x) * 4
  //     let r = cam.pixels[i + 0]
  //     let g = cam.pixels[i + 1]
  //     let b = cam.pixels[i + 2]
  //     let br = (r + g + b) / 3
  //     let z = map(br, 0, 255, 500, 0)
  //     push()
  //     translate(-width / 2, -height / 2, z)
  //     fill(r, g, b)
  //     nostroke()
  //     rect(x, y, s)
  //     pop()
  //   }
  // }

}

