class Sensor {
  static launchSequenceCounter = 0

  constructor(angle, distance) {
    // Physics of rocket at current instance
    this.angle = angle // -1 (left) to 1 (right)
    this.distance = distance
    this.origin = null
    this.range = null
    this.detection = false
    this.detectionHistory = []

    this.rotation = p5.Vector.fromAngle(-radians(90 * this.angle))

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
    const previousState = this.detection
    // Find out if any of the objects collides with the sensor
    const detectedObject = Stage.objects.find((obj) =>
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
    )

    const detectedLeft = this.range.x < 0
    const detectedRight = this.range.x > width
    const detectedTop = this.range.y < 0
    const detectedBottom = this.range.y > height
    const detectedBorders = detectedLeft || detectedRight || detectedTop || detectedBottom

    this.detection = detectedObject || detectedBorders

    // Check if there is a new detection.
    if (!previousState && this.detection)
      this.detectionHistory.push(
        detectedObject?.id ||
          (detectedBorders &&
            (detectedLeft
              ? 'detectedLeft'
              : null || detectedRight
              ? 'detectedRight'
              : null || detectedTop
              ? 'detectedTop'
              : null || detectedBottom
              ? 'detectedBottom'
              : null))
      )

    if (config.debugMode) {
      // this.debug +=
      //   'range: ' +
      //   this.debugV(this.range) +
      //   ' <br/>' +
      //   'origin: ' +
      //   this.debugV(this.origin) +
      //   ' <br/>'
      // this.debug += JSON.stringify(this.detectionHistory)
      // logP.html(this.debug)
      // this.debug = ''
    }
  }

  getDetectedObjects() {
    return this.detectionHistory
  }

  getDifferentDetectedObjects() {
    return [...new Set(this.detectionHistory)]
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
    stroke(color(this.detection ? 'darkred' : 'DarkGreen'))
    line(this.origin.x, this.origin.y, this.range.x, this.range.y)
    smooth()
    pop()
  }
}
