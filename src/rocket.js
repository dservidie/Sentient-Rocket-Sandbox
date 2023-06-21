// Constructor function
class Rocket {
  static launchSequenceCounter = 0

  constructor(...args) {
    let neuralNetwork = args[0]
    this.sensors = args[1] || []
    this.addSensor(new Sensor(-0.5, 60))
    this.addSensor(new Sensor(0, 100))
    this.addSensor(new Sensor(0.5, 60))
    this.noseColor = 'red'

    // Physics of rocket at current instance
    this.tiltAcc = 0 // Rotation acceleration
    this.rotation = p5.Vector.fromAngle(-radians(90))
    this.pos = createVector(width / 2, height - 25)
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0)
    this.maneuver = Rocket.createCommand(0.0, 0.0, 1)
    this.maneuverTimeout = 0

    this.command = 0 // Number of current command
    this.success = false // Checks rocket has reached target
    this.crashed = false // Checks if rocket had crashed
    this.flying = true // Checks if rocket is active
    this.launchSequence = Rocket.launchSequenceCounter++ // Indicates the order to be launched to avoid a mess
    // Performance counters
    this.fuelUsed = 0
    this.distanceTraveled = 0
    this.closestTargetDistance = Number.MAX_VALUE / 2
    this.finalTargetDistance = 10000000000
    this.fitness = 0
    // Gives a neural network
    if (neuralNetwork) {
      this.neuralNetwork = neuralNetwork
    } else {
      const inputsCount = this.sensors.length + 3
      this.neuralNetwork = new NeuralNetwork(inputsCount, 100, 2)

      /*
        Choosing Hidden Layers

        Well if the data is linearly separable then you don't need any hidden layers at all. 
        If data is less complex and is having fewer dimensions or features then neural networks with 1 to 2 hidden layers would work.
        If data is having large dimensions or features then to get an optimum solution, 3 to 5 hidden layers can be used. 
        It should be kept in mind that increasing hidden layers would also increase the complexity of the model and choosing hidden layers such as 8, 9, or in two digits may sometimes lead to overfitting.

        Choosing Nodes in Hidden Layers

        Once hidden layers have been decided the next task is to choose the number of nodes in each hidden layer.

        The number of hidden neurons should be between the size of the input layer and the output layer.
        The most appropriate number of hidden neurons is
          sqrt(input nodes * output nodes)

        The number of hidden neurons should keep on decreasing in subsequent layers to get more and more close to pattern and feature extraction and to identify the target class.
        These above algorithms are only a general use case and they can be molded according to use case. Sometimes the number of nodes in hidden layers can increase also in subsequent layers and the number of hidden layers can also be more than the ideal case.

        This whole depends upon the use case and problem statement that we are dealing with.

      */
    }
    this.debug = ''
  }

  mutate() {
    this.neuralNetwork.mutate(0.1)
  }

  calculateDistance() {
    let d = dist(this.pos.x, this.pos.y, Stage.target.x, Stage.target.y)
    this.finalTargetDistance = d
    return d
  }

  // Updates state of rocket
  update() {
    // if rocket has not got to goal and not crashed then update physics engine
    if (this.flying) {
      // Checks distance from rocket to target
      var d = this.calculateDistance()

      // If distance less than 10 pixels, then it has reached target
      if (d < 10) {
        this.success = true
        this.crashed = false
        this.flying = false
        this.pos = Stage.target.copy()

        Population.increaseSuccessCounter()
      }
      // Rocket hit the barrier
      if (Stage.rocketCollision(this)) {
        this.crashed = true
        this.flying = false
        Population.increaseFailedCounter()
      }

      this.updateSensors()

      // After the configured amount of frames, gets the next command
      if (this.maneuverTimeout <= 0) {
        // The command finished, need to load the next one.
        this.maneuver = this.getCommand() // gets the next maneuver to perform during the next config.commandDuration frames
        this.tiltAcc = this.maneuver.steering
        this.maneuverTimeout = this.maneuver.duration
      }
      this.maneuverTimeout--
      // Rotates according to the steering of the maneuver and rocket Maneuverability
      this.rotation.rotate(this.tiltAcc * config.rocketManeuverability)

      // Calculates and applies the thrust force
      let thrust = this.rotation.copy()
      thrust.setMag(config.rocketThrust * this.maneuver.thrust)
      thrust.div(config.rocketMass)
      this.acc.add(thrust)

      // Applies the acceleration
      this.vel.add(this.acc)

      // Calculates and applies the drag force according to the traveling angle of the rocket
      let dragForce = this.vel.copy().normalize().mult(-1)
      let angle = abs(this.vel.angleBetween(this.rotation)) // calculates the angle between velocity and fuselage
      let dragCoefficient = map(angle, 0, 90, config.rocketDragMin, config.rocketDragMax)
      dragForce.setMag(dragCoefficient * this.vel.magSq())
      this.vel.add(dragForce)
      // Set the position accordingly to the velocity
      this.vel.limit(3)
      this.pos.add(this.vel)
      // saves performance data
      this.fuelUsed += this.maneuver.thrust
      this.distanceTraveled += this.vel.mag()
      if (d < this.closestTargetDistance) this.closestTargetDistance = d
      // Resets acceleration
      this.acc.mult(0)
    }
  }

  getCommand() {
    const sensing = this.sensors.map((s) => s.detection)
    // if (sensing[0] || sensing[1])
    //   return Rocket.createCommand(0.05, 0.9, 1);
    // if (sensing[1])
    //   return Rocket.createCommand(0.05, -0.9, 1);
    // if (sensing[2])
    //   return Rocket.createCommand(0.05, -0.9, 1);
    // let nextCommand = this.dna.genes[this.command];
    // this.command++;
    // return nextCommand;

    let inputs = []
    //inputs[0] = 1
    inputs.push(this.vel.x / 2)
    inputs.push(this.vel.y / 2)
    inputs.push(this.tiltAcc)
    this.sensors.forEach((sensor) => {
      inputs.push(sensor.detection ? 1 : 0)
    })

    //inputs.push(this.acc)
    // inputs[3] = closest.x / width;
    // inputs[4] = this.velocity / 10;
    let output = this.neuralNetwork.predict(inputs)
    // console.log('output', output)
    const [thrust, steering] = output
    // console.log('inputs: ', inputs, '/ output: ', output)
    // //if (output[0] > output[1] && this.velocity >= 0) {
    // if (output[0] > output[1]) {
    //   // this.up();
    // }

    return Rocket.createCommand(thrust, steering, 10)
  }

  addSensor(sensor) {
    this.sensors.push(sensor)
  }

  updateSensors() {
    this.sensors.forEach((s) => {
      s.update(this.rotation, this.pos)
    })
  }

  static createCommand(thrust, steering, duration) {
    return { thrust: thrust, steering: steering, duration: duration }
  }

  debugV(vector) {
    return (
      'v{ X: ' +
      vector.x +
      ' | Y: ' +
      vector.y +
      ' | ' +
      degrees(vector.heading()).toFixed(2) +
      ' }'
    )
  }

  // displays rocket to window
  draw() {
    push()
    noStroke()
    // translate to the position of rocket
    translate(this.pos.x, this.pos.y)
    // rotates to the angle the rocket is pointing
    rotate(this.rotation.heading())

    noSmooth()
    triangle(-3, 5, -3, -5, 15, 0)

    fill(this.noseColor)
    arc(5, 0, 25, 5, PI + HALF_PI, HALF_PI)
    fill(225, 225, 225)
    triangle(-3, 8, -3, -8, 5, 0)
    rectMode(CENTER)
    rect(0, 0, 10, 5)
    if (this.maneuver.thrust > 0 && this.flying) {
      // Draw exhaust flame
      noSmooth()
      fill(255, 240, 0)
      quad(
        -5,
        0,
        -8,
        -3 * this.maneuver.thrust,
        -(15 * this.maneuver.thrust + 5),
        random(-2, 2),
        -8,
        3 * this.maneuver.thrust
      )
      smooth()
    }
    pop()
    if (config.debugMode) {
      // Stage.drawArrow(this.vel, this.pos, this.noseColor, 25);
      this.sensors.forEach((s) => {
        s.draw()
      })
    }
  }
}
