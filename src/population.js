class Population {
  static successCounter = 0
  static failedCounter = 0

  static rockets = []
  static popSize

  static initialize() {
    // Array of rockets
    Population.rockets = []
    // Amount of rockets
    Population.popSize = config.popSize

    // Associates a rocket to an array index
    for (var i = 0; i < Population.popSize; i++) {
      Population.rockets[i] = new Rocket()
    }
  }

  static evaluate() {
    // Calculates the performance of the generation to normalize the fitness.
    let maxFuelUsed = 0
    let minFuelUsed = Number.MAX_VALUE / 2
    let maxDistanceTraveled = 0
    let minDistanceTraveled = Number.MAX_VALUE / 2
    let maxClosestTargetDistance = 0
    let minClosestTargetDistance = Number.MAX_VALUE / 2
    let maxFinalTargetDistance = 0
    let minFinalTargetDistance = Number.MAX_VALUE / 2
    let maxDetections = 0
    let minDetections = Number.MAX_VALUE / 2

    for (var r of Population.rockets) {
      r.rocketSensorsTotalDetections = r.getSensorsDetections().length

      if (r.fuelUsed > maxFuelUsed) maxFuelUsed = r.fuelUsed
      if (r.fuelUsed < minFuelUsed) minFuelUsed = r.fuelUsed
      if (r.distanceTraveled > maxDistanceTraveled) maxDistanceTraveled = r.distanceTraveled
      if (r.distanceTraveled < minDistanceTraveled) minDistanceTraveled = r.distanceTraveled
      if (r.closestTargetDistance > maxClosestTargetDistance)
        maxClosestTargetDistance = r.closestTargetDistance
      if (r.closestTargetDistance < minClosestTargetDistance)
        minClosestTargetDistance = r.closestTargetDistance
      if (r.finalTargetDistance > maxClosestTargetDistance)
        maxFinalTargetDistance = r.finalTargetDistance
      if (r.finalTargetDistance < minClosestTargetDistance)
        minFinalTargetDistance = r.finalTargetDistance
      if (r.rocketSensorsTotalDetections > maxDetections)
        maxDetections = r.rocketSensorsTotalDetections
      if (r.rocketSensorsTotalDetections < minDetections)
        minDetections = r.rocketSensorsTotalDetections
    }
    // TMP fix
    maxFuelUsed += 0.0000000001
    maxDistanceTraveled += 0.0000000001
    maxClosestTargetDistance += 0.0000000001
    maxFinalTargetDistance += 0.0000000001
    maxDetections += 0.0000000001

    if (config.debugMode) {
      console.log('#######################################')
      // console.log('fuelUsed: ', minFuelUsed, ' / ', maxFuelUsed)
      // console.log('distanceTraveled: ', minDistanceTraveled, ' / ', maxDistanceTraveled)
      // console.log(
      //   'closestTargetDistance: ',
      //   minClosestTargetDistance,
      //   ' / ',
      //   maxClosestTargetDistance
      // )
      // console.log(
      //   'finalTargetDistance: ',
      //   minFinalTargetDistance,
      //   ' / ',
      //   maxFinalTargetDistance
      // )
      console.log('Detections: ', minDetections, ' / ', maxDetections)
      console.log('#######################################')
    }
    // Calculates fitness
    for (let r of Population.rockets) {
      // let fuelUsedScore =
      //   map(r.fuelUsed, minFuelUsed, maxFuelUsed, 0, 1) * config.score_FuelUsed
      // let distanceTraveledScore =
      //   map(r.distanceTraveled, minDistanceTraveled, maxDistanceTraveled, 0, 1) *
      //   config.score_DistanceTraveled
      let closestTargetDistanceScore =
        map(
          r.closestTargetDistance,
          minClosestTargetDistance,
          maxClosestTargetDistance,
          1,
          0
        ) * config.score_ClosestTargetDistance
      let finalTargetDistanceScore =
        map(r.finalTargetDistance, minFinalTargetDistance, maxFinalTargetDistance, 1, 0) *
        config.score_FinalTargetDistance

      let finalDetectionsScore =
        map(r.rocketSensorsTotalDetections, minDetections, maxDetections, 1, 0) *
        config.score_SensorDetection

      r.fitness = closestTargetDistanceScore + finalTargetDistanceScore //finalDetectionsScore
      //  fuelUsedScore +
      //  distanceTraveledScore +

      if (config.debugMode) {
        console.log('######################')
        // console.log('fuelUsedScore:', fuelUsedScore, ' / r.fuelUsed: ', r.fuelUsed)
        // console.log(
        //   'distanceTraveledScore:',
        //   distanceTraveledScore,
        //   ' / r.distanceTraveled: ',
        //   r.distanceTraveled
        // )
        // console.log(
        //   'closestTargetDistanceScore:',
        //   closestTargetDistanceScore,
        //   ' / r.closestTargetDistance: ',
        //   r.closestTargetDistance
        // )
        // console.log(
        //   'finalTargetDistanceScore:',
        //   finalTargetDistanceScore,
        //   ' / r.finalTargetDistance: ',
        //   r.finalTargetDistance
        // )
        console.log(
          'finalDetectionsScore:',
          finalDetectionsScore,
          ' / r.rocketSensorsTotalDetections: ',
          r.rocketSensorsTotalDetections
        )

        console.log('# FITNESS: ', r.fitness)
      }
    }
    console.log('### Population.rockets', Population.rockets)

    // Normalizing the fitness value.
    const maxFitness = Math.max(...Population.rockets.map((r) => r.fitness))
    Population.rockets.forEach((r) => (r.fitness /= maxFitness))
    Population.rockets.sort((a, b) => b.fitness - a.fitness)

    console.log(
      '#### ROCKETS fitness: ',
      Population.rockets.map((r) => r.fitness)
    )

    // Take rockets fitness make in to scale of 10 to 100
    // A rocket with high fitness will be most likely in the mating pool
    const bestRockets = Population.rockets.slice(0, Math.ceil(Population.popSize * 0.2))
    console.log('bestRockets', bestRockets)
    // console.log('bestRockets', bestRockets)
    let newRockets = []
    Rocket.launchSequenceCounter = 0 // Just for graphical look.
    for (var i = 0; i < Population.popSize; i++) {
      var baseRocket = random(bestRockets)
      var childNN = baseRocket.neuralNetwork.copy()
      childNN.mutate(config.mutationRate) // * (1-(baseRocket.fitness))
      // Creates new rocket with child Neural Network
      newRockets.push(new Rocket(childNN))
    }

    // This instance of rockets are the new rockets
    Population.rockets = newRockets

    Population.successCounter = 0
    Population.failedCounter = 0
  }

  // Calls for update and show functions
  static run(mustDraw) {
    for (var r of Population.rockets) {
      if (framesCounter / 5 > r.launchSequence) {
        r.update()
        // Displays rockets to screen
        if (mustDraw) r.draw()
      }
    }
  }

  // Checks if all missiles are crashed
  static simulationFinished() {
    if (framesCounter > config.timeoutFrames) {
      for (let r of Population.rockets) {
        r.flying = false
      }
      return true
    }

    for (let r of Population.rockets) {
      if (r.flying) {
        return false
      }
    }
    return true
  }

  static increaseSuccessCounter() {
    Population.successCounter++
  }
  static increaseFailedCounter() {
    Population.failedCounter++
  }
}
