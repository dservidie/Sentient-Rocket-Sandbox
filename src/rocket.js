class Rocket {
  static launchSequenceCounter = 0

  constructor(...args) {
    let neuralNetwork = args[0]
    this.sensors = args[1] || []
    this.addSensor(new Sensor(-0.5, 80))
    this.addSensor(new Sensor(-0.25, 90))
    this.addSensor(new Sensor(0, 120))
    this.addSensor(new Sensor(0.25, 90))
    this.addSensor(new Sensor(0.5, 80))
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
    this.rocketSensorsTotalDetections = 0
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
      this.neuralNetwork = new NeuralNetwork(inputsCount, inputsCount * 2, 2)
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
    let inputs = []
    //inputs[0] = 1
    inputs.push(this.vel.x / 2)
    inputs.push(this.vel.y / 2)
    inputs.push(this.tiltAcc)
    this.sensors.forEach((sensor) => {
      inputs.push(sensor.detection ? 1 : 0)
    })
    let output = this.neuralNetwork.predict(inputs)
    const [thrust, steering] = output

    // console.log('inputs: ', inputs, '/ output: ', output)
    return Rocket.createCommand(thrust, steering * 2 - 1, 10)
  }

  addSensor(sensor) {
    this.sensors.push(sensor)
  }

  updateSensors() {
    this.sensors.forEach((s) => {
      s.update(this.rotation, this.pos)
    })
  }

  getSensorsDetections() {
    const detections = this.sensors.map((s) => s.getDetectedObjects()).flat()
    return [...new Set(detections)]
  }

  static createCommand(thrust, steering, duration) {
    return { thrust: thrust + 0.000005, steering: steering, duration: duration }
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
    if (config.debugMode && this.flying) {
      // Stage.drawArrow(this.vel, this.pos, this.noseColor, 25);
      this.sensors.forEach((s) => {
        s.draw()
      })
    }
    if (simplifyDrawing) {
      noSmooth()
      noStroke()
      rect(this.pos.x, this.pos.y, 10, 10)
      point()
      smooth()
    } else {
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
    }
  }
}
