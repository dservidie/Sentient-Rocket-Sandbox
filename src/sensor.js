// Constructor function
class Sensor {
  static launchSequenceCounter = 0

  constructor(angle, distance) {
    // Physics of rocket at current instance
    this.angle = angle // -1 (left) to 1 (right)
    this.distance = distance
    this.origin = null
    this.range = null
    this.detection = false

    this.rotation = p5.Vector.fromAngle(-radians(90 * this.angle))

    this.color = 'yellow'
    this.debug = ''
  }

  // displays rocket to window
  update(rotation, position) {
    this.origin = position
    let range = position.copy()
    let direction = rotation.copy()
    direction.setMag(this.distance)
    direction.rotate(radians(90 * this.angle))
    range.add(direction)
    this.range = range

    this.rotation = direction
    // Find out if any of the objects colides with the sensor
    this.detection =
      Stage.objects.some((obj) =>
        collideLineRect(
          this.origin.x,
          this.origin.y,
          this.range.x,
          this.range.y,
          obj.rx,
          obj.ry,
          obj.rw,
          obj.rh,
          false
        )
      ) ||
      this.range.x > width ||
      this.range.x < 0 ||
      this.range.y > height ||
      this.range.y < 0

    this.color = this.detection ? 'red' : 'yellow'

    if (config.debugMode) {
      this.debug +=
        'range: ' +
        this.debugV(this.range) +
        ' <br/>' +
        'origin: ' +
        this.debugV(this.origin) +
        ' <br/>'
      logP.html(this.debug)
      this.debug = ''
    }
  }

  debugV(vector) {
    return (
      'v{ X: ' +
      vector.x.toFixed(2) +
      ' | Y: ' +
      vector.y.toFixed(2) +
      ' | ' +
      degrees(vector.heading()).toFixed(2) +
      '°}'
    )
  }

  // displays rocket to window
  draw() {
    push()
    noSmooth()
    stroke(color(this.color))
    line(this.origin.x, this.origin.y, this.range.x, this.range.y)
    smooth()
    pop()
  }
}
