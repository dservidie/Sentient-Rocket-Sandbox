const config = {
  popSize: 50,
  timeoutFrames: 1000,
  // Each rocket will last commandsAmount commands
  commandsAmount: 90,
  commandsAmountMin: 10, // How many Frames we let commands to execute
  commandsAmountMax: 30, // How many Frames we let commands to execute
  physics: {
    // Rocket physics configuration
    rocketMass: 0.3, // 1.7
    rocketThrust: 0.05,
    rocketManeuverability: 0.08, // In radians per frame
    rocketDragLow: 0.001, // Drag traveling at cero degrees
    rocketDragHigh: 1.5, // Drag while traveling sideways (90 degrees)
  },
  scoring: {
    // Fitness calculation scores
    score_SensorDetection: 10,
    score_FuelUsed: -1,
    score_DistanceTraveled: 3,
    score_ClosestTargetDistance: 150,
    score_FinalTargetDistance: 70,
  },

  // Sets how likely are one gene to mutate. 0: No mutation at all / 1: Mutate all genes.
  mutationRate: 0.1,
  // In case of mutation, how much must change the gene. 1: New gene 0: No change
  mutationDeviation: 0.35,
  debugMode: true,
}
