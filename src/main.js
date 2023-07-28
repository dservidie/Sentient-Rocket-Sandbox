var paused = false
var scenesList

var population
// Made to display count on screen
var generationP, lifeP, statusP, logP
// Keeps track of frames and generations
var framesCounter = 0,
  generationCounter = 1

var drawing = true
var simplifyDrawing = false

function setup() {
  console.log('SETUP START')
  let canvas = createCanvas(500, 600)
  canvas.parent('canvasDiv')

  Population.initialize()

  Stage.initialize()

  // TODO: Add support for Align options Ej: { ry: 140, hAlign: 'right' }
  Stage.addBarrier(new Barrier(90, 175, 150, 50))
  Stage.addBarrier(new Barrier(200, 0, 110, 50))
  Stage.addBarrier(new Barrier(200, 390, 110, 50))
  Stage.addBarrier(new Barrier(330, 175, 150, 50))
  Stage.addBarrier(new Barrier(450, 0, 210, 150))
  Stage.addBarrier(new Barrier(450, 290, 210, 150))

  createUI()
}

function draw() {
  if (paused) return
  // drawing = skipFrames(15)
  if (drawing) background(0)
  Population.run(drawing)

  let simulationFinished = Population.simulationFinished()
  // Displays count to window
  if (skipFrames(15)) {
    generationP.html('Generation #' + generationCounter)
    lifeP.html('Frame: ' + framesCounter + ' - ' + frameRate())
  }

  framesCounter++

  // Renders barrier for rockets
  Stage.draw(drawing)

  if (simulationFinished && !paused) {
    paused = true
    // gives some time for human read outputs
    setTimeout(() => {
      Population.evaluate()
      framesCounter = 0
      generationCounter++
      paused = false
    }, 1500)
  }
}

function mouseClicked() {
  if (paused) {
    paused = false
  } else {
    paused = true
  }
}

function resetSimulation() {
  Rocket.launchSequenceCounter = 0
  Population.initialize()
}

function createUI() {
  // Create the GUI
  guiControls = createGui('Controls').setPosition(5, 5)
  let qsControls = guiControls.getQS()
  qsControls.addHTML(
    'How to use',
    'You can add barriers. Select a barrier to edit its properties. Drag and drop to move them in the stage'
  )
  scenesList = Stage.listScenes()
  guiControls.addGlobals('scenesList')
  guiControls.addComponent({
    label: 'Load Scene',
    callback: loadScene,
  })

  // Create physics GUI
  sliderRange(0, Math.max(width, height), 0.0001)
  guiPhysics = createGui('Physics (double click to expand)').setPosition(width - 200, 5)
  guiPhysics.addObject({ ...config.physics, ...config.physicsRanges })

  let qsPhysics = guiPhysics.getQS()
  qsPhysics.saveInLocalStorage('sentient-rockets-physics')
  qsPhysics.collapse()

  // Creation of controls
  generationP = createP()
  lifeP = createP()
  statusP = createP()
  logP = createP('')

  // Setting the right place
  generationP.parent('display')
  lifeP.parent('display')
  statusP.parent('display')
  logP.parent('display')
}

function loadScene() {
  let sceneName = scenesList
  Stage.loadByName(sceneName)
}
function skipFrames(frames) {
  return framesCounter % frames === 0
}
