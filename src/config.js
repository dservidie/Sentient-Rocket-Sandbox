const config = {
  popSize: 25,
  timeoutFrames: 500,
  // Each rocket will last commandsAmount commands
  commandsAmount: 90,
  commandDurationMin: 10, // How many Frames we let commands to execute
  commandDurationMax: 30, // How many Frames we let commands to execute
  // Rocket physics configuration
  rocketMass: 0.3, // 1.7
  rocketThrust: 0.07,
  rocketManeuverability: 0.08, // In radians per frame
  rocketDragMin: 0.001, // Drag traveling at cero degrees
  rocketDragMax: 1.5, // Drag while traveling sideways (90 degrees)
  // Fitness calculation scores
  score_FuelUsed: -1,
  score_DistanceTraveled: 3,
  score_ClosestTargetDistance: 15,
  score_FinalTargetDistance: 7,
  // Sets how likely are one gene to mutate. 0: No mutation at all / 1: Mutate all genes.
  mutationRate: 0.1,
  // In case of mutation, how much must change the gene. 1: New gene 0: No change
  mutationDeviation: 0.35,
  debugMode: false,
}
