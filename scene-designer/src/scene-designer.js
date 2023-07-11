let bx
let by
let boxSize = 75
let overBox = false
let locked = false
let xOffset = 0.0
let yOffset = 0.0

function setup() {
  console.log('SETUP START')
  let canvas = createCanvas(500, 600)
  canvas.parent('canvasDiv')

  bx = width / 2.0
  by = height / 2.0
  rectMode(RADIUS)
  strokeWeight(2)

  Stage.initialize()

  // TODO: Add support for Align options Ej: { ry: 140, hAlign: 'right' }
  Stage.addBarrier({ ry: 90, rx: 175, rw: 150, rh: 50 })

  Stage.addBarrier({ ry: 200, rx: 0, rw: 110, rh: 50 })
  Stage.addBarrier({ ry: 200, rx: 390, rw: 110, rh: 50 })

  Stage.addBarrier({ ry: 330, rx: 175, rw: 150, rh: 50 })

  Stage.addBarrier({ ry: 450, rx: 0, rw: 110, rh: 150 })
  Stage.addBarrier({ ry: 450, rx: 390, rw: 110, rh: 150 })

  createUI()
}

function draw() {
  background(0)

  // Test if the cursor is over the box
  if (
    mouseX > bx - boxSize &&
    mouseX < bx + boxSize &&
    mouseY > by - boxSize &&
    mouseY < by + boxSize
  ) {
    overBox = true
    if (!locked) {
      stroke(255)
      fill(244, 122, 158)
    }
  } else {
    stroke(156, 39, 176)
    fill(244, 122, 158)
    overBox = false
  }

  // Draw the box
  rect(bx, by, boxSize, boxSize)

  // Renders barrier for rockets
  Stage.draw(true)
}

function mousePressed() {
  if (overBox) {
    locked = true
    fill(255, 255, 255)
  } else {
    locked = false
  }
  xOffset = mouseX - bx
  yOffset = mouseY - by
}

function mouseDragged() {
  if (locked) {
    bx = mouseX - xOffset
    by = mouseY - yOffset
  }
}

function mouseReleased() {
  locked = false
}

function createUI() {
  // Creation of controls
  logP = createP('')
  logP.parent('display') // Setting it in the right place
  const button = createButton('Add barrier')
  button.position(0, 0)
  button.mousePressed(() => {
    Stage.addBarrier({ ry: height / 2, rx: width / 2, rw: 50, rh: 50 })
  })
}
