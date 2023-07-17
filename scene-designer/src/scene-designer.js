var guiPhysics, guiControls

var myAngle = 30,
  myAngleMin = 0,
  myAngleMax = 1000,
  myAngleStep = 10

var myColor = '#eeee00'

let overBox = false
let locked = false
let selectedObject
let draggingObject
let mousePreviousX
let mousePreviousY

let logP

function setup() {
  console.log('SETUP START')
  let canvas = createCanvas(500, 600)
  canvas.parent('canvasDiv')

  strokeWeight(2)

  Stage.initialize()

  // TODO: Add support for Align options Ej: { ry: 140, hAlign: 'right' }
  Stage.addBarrier(new Barrier(190, 275, 150, 150))
  Stage.addBarrier(new Barrier(290, 75, 150, 150))

  createUI()
}

function draw() {
  background(0)

  // Test if the cursor is over the box
  // Rocket hits one object
  if (!locked) {
    draggingObject = null
    // Inverted so item on top has priority
    for (let obj of Stage.objects.slice().reverse()) {
      if (!draggingObject && obj.isCollidingWithPoint(mouseX, mouseY)) {
        obj.color = 'Gainsboro'
        draggingObject = obj
      } else {
        obj.color = 'White'
      }
    }
  }

  logP.html(
    'Selected:' +
      JSON.stringify(selectedObject) +
      '</BR>' +
      'Dragging: ' +
      JSON.stringify(draggingObject)
  )
  // Renders barrier for rockets
  Stage.draw(true)
}

function mousePressed() {
  mousePreviousX = mouseX
  mousePreviousY = mouseY
  if (draggingObject) {
    locked = true
    selectedObject = draggingObject
    draggingObject.color = 'PaleGreen'
  } else {
    locked = false
    selectedObject = null
  }
}

function mouseDragged() {
  if (locked && draggingObject) {
    draggingObject.rx += mouseX - mousePreviousX
    draggingObject.ry += mouseY - mousePreviousY
    mousePreviousX = mouseX
    mousePreviousY = mouseY
  }
}

function mouseReleased() {
  locked = false
}

function createUI() {
  // Create the GUI
  sliderRange(0, 90, 1)
  guiControls = createGui('Controls').setPosition(5, 5)
  guiControls.addGlobals('myColor', 'myAngle')
  guiControls.addComponent({
    label: 'Add Barrier',
    callback: addBarrier,
  })

  // Create Shape GUI
  guiPhysics = createGui('Physics').setPosition(width - 200, 5)
  sliderRange(0, 50, 1)
  guiPhysics.addObject(config.physics)

  // Creation of controls
  logP = createP('')
  logP.parent('display') // Setting it in the right place
}

function addBarrier() {
  Stage.addBarrier(new Barrier(height / 2, width / 2))
}
