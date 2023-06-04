var paused = false;
var population;
// Made to display count on screen
var generationP, lifeP, statusP, logP;
// Keeps track of frames and generations
var FPS = 0,
  generationCounter = 1;

var rocket;

function setup() {
  console.log('SETUP START');
  let canvas = createCanvas(600, 400);
  canvas.parent('canvasDiv');
  // Population.initialize();

  Stage.initialize();
  Stage.addBarrier({ rx: 200, ry: 250, rw: 200, rh: 12 });
  Stage.addBarrier({ rx: 0, ry: 140, rw: 150, rh: 12 });
  Stage.addBarrier({ rx: 450, ry: 140, rw: 150, rh: 12 });
  createUI();

  rocket = new Rocket();
}

function draw() {
  background(0);
  console.log('START');
  // Population.run();
  if (FPS / 5 > rocket.launchSecuence) {
    rocket.update();
    // Displays rockets to screen
    rocket.draw();
  }

  //let simulationFinished = Population.simulationFinished();
  // Displays count to window
  if (skipFrames(15)) {
    generationP.html('Generation #' + generationCounter);
    lifeP.html('Frame: ' + FPS);
    // statusP.html(
    //   'Success: &emsp; Failed: ' +
    //     '<br/><br/>&emsp;&emsp;' +
    //     Population.successCounter +
    //     ' &emsp;&emsp;&emsp;&emsp;' +
    //     Population.failedCounter
    // );
  }

  FPS++;

  // Renders barrier for rockets
  Stage.draw();

  // if (simulationFinished && !paused) {
  //   paused = true;
  //   // gives some time for human read
  //   setTimeout(() => {
  //     Population.evaluate();
  //     Population.selection();
  //     FPS = 0;
  //     generationCounter++;
  //     paused = false;
  //   }, 1500);
  // }
}

function resetSimulation() {
  Rocket.launchSecuenceCounter = 0;
  Population.initialize();
}

function createUI() {
  // Creation of controls
  generationP = createP();
  lifeP = createP();
  statusP = createP();
  logP = createP('');

  // Setting the right place
  generationP.parent('display');
  lifeP.parent('display');
  statusP.parent('display');
  logP.parent('display');

  // Configurations: These resets the simulation
  createSliderUI(
    'popSize',
    createSlider(5, 50, config.popSize, 1),
    'controls',
    (c) => {
      config.popSize = c.target.value;
      resetSimulation();
    }
  );
  createSliderUI(
    'commandsAmount',
    createSlider(10, 50, config.commandsAmount, 5),
    'controls',
    (c) => {
      config.commandsAmount = c.target.value;
      resetSimulation();
    }
  );
  createSliderUI(
    'commandDurationMin',
    createSlider(5, 15, config.commandDurationMin, 1),
    'controls',
    (c) => {
      config.commandDurationMin = c.target.value;
      resetSimulation();
    }
  );
  createSliderUI(
    'commandDurationMax',
    createSlider(20, 40, config.commandDurationMax, 1),
    'controls',
    (c) => {
      config.commandDurationMax = c.target.value;
      resetSimulation();
    }
  );
  createSliderUI(
    'mutationRate',
    createSlider(0.01, 0.15, config.mutationRate, 0.01),
    'controls',
    (c) => {
      config.mutationRate = c.target.value;
    }
  );
  createSliderUI(
    'mutationDeviation',
    createSlider(0.01, 0.4, config.mutationDeviation, 0.01),
    'controls',
    (c) => {
      config.mutationDeviation = c.target.value;
    }
  );

  // Physics: Changing these dont resets the simulation, but will require rockets some generations to readapt to new values.
  createSliderUI(
    'rocketMass',
    createSlider(0.5, 10.0, config.rocketMass, 0.1),
    'physics',
    (c) => {
      config.rocketMass = c.target.value;
    }
  );
  createSliderUI(
    'rocketThrust',
    createSlider(0.001, 0.2, config.rocketThrust, 0.0005),
    'physics',
    (c) => {
      config.rocketThrust = c.target.value;
    }
  );
  createSliderUI(
    'rocketManeuverability',
    createSlider(0.05, 0.2, config.rocketManeuverability, 0.01),
    'physics',
    (c) => {
      config.rocketManeuverability = c.target.value;
    }
  );
  createSliderUI(
    'rocketDragMin',
    createSlider(0.0001, 0.1, config.rocketDragMin, 0.0005),
    'physics',
    (c) => {
      config.rocketDragMin = c.target.value;
    }
  );
  createSliderUI(
    'rocketDragMax',
    createSlider(0.2, 5.0, config.rocketDragMax, 0.01),
    'physics',
    (c) => {
      config.rocketDragMax = c.target.value;
    }
  );

  configUI();
}

function createSliderUI(lable, slider, parent, onChange) {
  //slider = createCheckbox('label', false);
  let parentDiv = createDiv(lable);
  parentDiv.parent(parent);
  let containerDiv = createDiv('');
  containerDiv.parent(parentDiv);
  containerDiv.class('range-wrap');
  slider.parent(containerDiv);
  slider.class('range');
  slider.changed(onChange);
  let output = createElement('output');
  output.parent(containerDiv);
  output.class('bubble');
}

function configUI() {
  const allRanges = document.querySelectorAll('.range-wrap');
  allRanges.forEach((wrap) => {
    const range = wrap.querySelector('.range');
    const bubble = wrap.querySelector('.bubble');
    range.addEventListener('input', () => {
      setBubble(range, bubble);
    });
    setBubble(range, bubble);
  });
}
function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;
  bubble.style.left = `${newVal * 1.1}px`;
}

function skipFrames(frames) {
  return FPS % frames == 0;
}
