const config = {
  simulation: {
    popSize: 50,
    timeoutFrames: 1000,
  },
  simulationRanges: {
    popSizeMin: 10,
    popSizeMax: 100,
  },

  physics: {
    // Rocket physics configuration
    rocketMass: 0.3, // 1.7
    rocketThrust: 0.03,
    rocketManeuverability: 0.08, // In radians per frame
    rocketDragLowest: 0.005, // Drag traveling at cero degrees
    rocketDragHighest: 2.5, // Drag while traveling sideways (90 degrees)
  },

  physicsRanges: {
    rocketMassMin: 0.5,
    rocketMassMax: 10.0,
    rocketThrustMin: 0.001,
    rocketThrustMax: 0.2,
    rocketManeuverabilityMin: 0.05,
    rocketManeuverabilityMax: 0.2,
    rocketDragLowestMin: 0.0001,
    rocketDragLowestMax: 0.1,
    rocketDragHighestMin: 0.2,
    rocketDragHighestMax: 5.0,
  },

  // Fitness calculation scores
  score_SensorDetection: 10,
  score_FuelUsed: -1,
  score_DistanceTraveled: 3,
  score_ClosestTargetDistance: 150,
  score_FinalTargetDistance: 70,

  // Sets how likely are one gene to mutate. 0: No mutation at all / 1: Mutate all genes.
  mutationRate: 0.1,
  // 'mutationRate' 0.01, 0.15, config.mutationRate, 0.01),
  // 'mutationDeviation' 0.01, 0.4

  // In case of mutation, how much must change the gene. 1: New gene 0: No change
  mutationDeviation: 0.35,
  debugMode: true,
}
