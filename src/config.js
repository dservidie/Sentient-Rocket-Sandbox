const config = {
  popSize: 50,
  timeoutFrames: 1000,
  // Each rocket will last commandsAmount commands
  commandsAmount: 90,
  commandDurationMin: 10, // How many Frames we let commands to execute
  commandDurationMax: 30, // How many Frames we let commands to execute
  // Rocket physics configuration
  rocketMass: 0.3, // 1.7
  rocketThrust: 0.03,
  rocketManeuverability: 0.08, // In radians per frame
  rocketDragMin: 0.005, // Drag traveling at cero degrees
  rocketDragMax: 2.5, // Drag while traveling sideways (90 degrees)
  // Fitness calculation scores
  score_SensorDetection: 10,
  score_FuelUsed: -1,
  score_DistanceTraveled: 3,
  score_ClosestTargetDistance: 150,
  score_FinalTargetDistance: 70,
  // Sets how likely are one gene to mutate. 0: No mutation at all / 1: Mutate all genes.
  mutationRate: 0.1,
  // In case of mutation, how much must change the gene. 1: New gene 0: No change
  mutationDeviation: 0.35,
  debugMode: true,
}
