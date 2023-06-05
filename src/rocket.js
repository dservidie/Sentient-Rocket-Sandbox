// Constructor function
class Rocket {
  static launchSecuenceCounter = 0;

  constructor(...args) {
    let dna = args[0];
 
    this.noseColor = 'red';

    // Physics of rocket at current instance
    this.tiltAcc = 0; // Rotation aceleration
    this.rotation = p5.Vector.fromAngle(-radians(90));
    this.pos = createVector(width / 2, height - 15);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maneuver = Rocket.createCommand(0.0, 0.0, 1);
    this.maneuverTimeout = 0;

    this.command = 0; // Number of current command
    this.success = false; // Checkes rocket has reached target
    this.crashed = false; // Checks if rocket had crashed
    this.flying = true; // Checks if rocket is active
    this.launchSecuence = Rocket.launchSecuenceCounter++; // Indicates the order to be launched to avoid a mess
    // Performance counters
    this.fuelUsed = 0;
    this.distanceTraveled = 0;
    this.closestTargetDistance = Number.MAX_VALUE;
    this.finalTargetDistance = Number.MAX_VALUE;
    this.fitness = 0;
    // Gives a rocket dna
    // if (dna) {
    //   this.dna = dna;
    // } else {
    //   this.dna = new DNA();
    // }
    this.debug = '';
  }

  // Updates state of rocket
  update() {
    // if rocket has not got to goal and not crashed then update physics engine
    if (this.flying) {
      // Checks distance from rocket to target
      var d = dist(this.pos.x, this.pos.y, Stage.target.x, Stage.target.y);

      // If distance less than 10 pixels, then it has reached target
      if (d < 10) {
        this.success = true;
        this.crashed = false;
        this.flying = false;
        this.pos = Stage.target.copy();
        this.finalTargetDistance = d;
        // Population.increaseSuccessCounter();
      }
      // Rocket hit the barrier
      if (Stage.rocketCollision(this)) {
        this.crashed = true;
        this.flying = false;
        this.finalTargetDistance = d;
        // Population.increaseFailedCounter();
      }

      this.getSensorsOutput();

      // After the configured ammount of frames, gets the next command
      if (this.maneuverTimeout <= 0) {
        // The command finished, need to load the next one.
        this.maneuver = this.getCommand(); // gets the next maneuver to perform during the next config.commandDuration frames
        this.tiltAcc = this.maneuver.steering;
        this.maneuverTimeout = this.maneuver.duration;
      }
      this.maneuverTimeout--;
      // Rotates according to the steering of the maneuver and rocket Maneuverability
      this.rotation.rotate(this.tiltAcc * config.rocketManeuverability);

      // Calculates and applies the thrust force
      let thrust = this.rotation.copy();
      thrust.setMag(config.rocketThrust * this.maneuver.thrust);
      thrust.div(config.rocketMass);
      this.acc.add(thrust);

      if (config.debugMode) {
        this.debug +=
          'maneuver: { steering: ' +
          this.maneuver.steering +
          ', thrust: ' +
          this.maneuver.thrust +
          ' } <br/>' +
          'this.tiltAcc: ' +
          this.tiltAcc +
          ' <br/>' +
          'this.acc: ' +
          this.debugV(this.acc) +
          ' <br/>' +
          'thrust: ' +
          this.debugV(thrust) +
          ' <br/>';
        logP.html(this.debug);
        this.debug = '';
      }

      // Applies the aceleration
      this.vel.add(this.acc);

      // Calculates and applies the drag force according to the traveling angle of the rocket
      let dragForce = this.vel.copy().normalize().mult(-1);
      let angle = abs(this.vel.angleBetween(this.rotation)); // calculates the angle between velocity and fuselage
      let dragCoefficient = map(
        angle,
        0,
        90,
        config.rocketDragMin,
        config.rocketDragMax
      );
      dragForce.setMag(dragCoefficient * this.vel.magSq());
      this.vel.add(dragForce);
      // Set the position accordingly to the velocity
      this.vel.limit(3);
      this.pos.add(this.vel);
      // saves performance data
      this.fuelUsed += this.maneuver.thrust;
      this.distanceTraveled += this.vel.mag();
      if (d < this.closestTargetDistance) this.closestTargetDistance = d;
      // Resets acceleration
      this.acc.mult(0);
    }
  }

  getCommand() {
    // let nextCommand = this.dna.genes[this.command];
    // this.command++;
    // return nextCommand;
    return Rocket.createCommand(0.2, 0, 10);
  }


  getSensorsOutput() {

    line(mouseX, mouseY, 350, 50);

    let hit = collideLineRect(mouseX, mouseY, 350, 50, 200, 300, 100, 150, true);
   
    if(hit)
    this.noseColor = 'green';



    return Rocket.createCommand(0.2, 0, 10);
  }

  static createCommand(thrust, steering, duration) {
    return { thrust: thrust, steering: steering, duration: duration };
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
    );
  }

  // displays rocket to window
  draw() {
    push();
    noStroke();
    //translate to the postion of rocket
    translate(this.pos.x, this.pos.y);
    //rotatates to the angle the rocket is pointing
    rotate(this.rotation.heading());
    fill(this.noseColor);
    arc(5, 0, 25, 5, PI + HALF_PI, HALF_PI);
    fill(225, 225, 225);
    triangle(-3, 8, -3, -8, 5, 0);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    if (this.maneuver.thrust > 0 && this.flying) {
      // Draw exaust flame
      noSmooth();
      fill(255, 240, 0);
      quad(
        -5,
        0,
        -8,
        -3 * this.maneuver.thrust,
        -(15 * this.maneuver.thrust + 5),
        random(-2, 2),
        -8,
        3 * this.maneuver.thrust
      );
      smooth();
    }
    pop();
    if (config.debugMode) {
      Stage.drawArrow(this.vel, this.pos, 'green', 25);
    }
  }
}
