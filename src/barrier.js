class Barrier {
  static nextId = 0

  constructor(ry, rx, rw = 50, rh = 50) {
    // TODO: Add support for Align options Ej: { ry: 140, hAlign: 'right' }
    this.id = Barrier.nextId++
    this.ry = ry
    this.rx = rx
    this.rw = rw
    this.rh = rh

    this.color = 'white'
  }

  isCollidingWithPoint(pointX, pointY) {
    return collidePointRect(pointX, pointY, this.rx, this.ry, this.rw, this.rh, false)
    // return (
    //   pointX > this.rx &&
    //   pointX < this.rx + this.rw &&
    //   pointY > this.ry &&
    //   pointY < this.ry + this.rh
    // )
  }

  isCollidingWithLine(firstPointX, firstPointY, secondPointX, secondPointY) {
    return collideLineRect(
      firstPointX,
      firstPointY,
      secondPointX,
      secondPointY,
      this.rx,
      this.ry,
      this.rw,
      this.rh,
      false
    )
  }

  draw() {
    fill(this.color)
    rect(this.rx, this.ry, this.rw, this.rh)
  }
}
