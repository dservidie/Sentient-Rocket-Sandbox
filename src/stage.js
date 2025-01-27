class Stage {
  static name
  static target
  static objects

  static initialize() {
    Stage.target = createVector(width / 2, 50)
    Stage.objects = []
  }

  static loadByName(sceneName) {
    let sceneStorageName = 'scene-' + sceneName.replace(' ', '-')
    let sceneJson = localStorage.getItem(sceneStorageName)
    Stage.name = sceneName
    Stage.loadJSON(sceneJson)
  }

  static loadJSON(jsonString) {
    let json = JSON.parse(jsonString)
    Object.assign(Stage, json)
    console.log('Stage.name', Stage.name)
    Stage.target = createVector(width / 2, 50)
    Stage.objects = json.objects.map((o) => Barrier.fromJSON(o))
  }

  static toJSON() {
    let jsonScene = {
      name: Stage.name,
      objects: Stage.objects,
    }
    return JSON.stringify(jsonScene, null, 2)
  }

  static listScenes() {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith('scene-'))
      .map((s) => s.replace('scene-', ''))
      .sort()
  }

  static addBarrier(barrier) {
    Stage.objects.push(barrier)
  }

  static rocketCollision(rocket) {
    // Rocket hits border of canvas
    if (
      rocket.pos.x > width ||
      rocket.pos.x < 0 ||
      rocket.pos.y > height ||
      rocket.pos.y < 0
    ) {
      return true
    }
    // Rocket hits one object
    for (let obj of Stage.objects) {
      if (obj.isCollidingWithPoint(rocket.pos.x, rocket.pos.y)) return true
    }
    return false
  }

  static draw(mustDraw) {
    if (mustDraw) {
      for (let obj of this.objects) {
        obj.draw()
      }
      // Renders target
      fill('LightGreen')
      ellipse(Stage.target.x, Stage.target.y, 16, 16)
    }
  }

  // draw an arrow for a vector at a given base position
  static drawArrow(vector, location, color, scale = 5) {
    push()
    stroke(color)
    fill(color)
    strokeWeight(3)
    translate(location.x, location.y)
    line(0, 0, vector.x * scale, vector.y * scale)
    rotate(vector.heading())
    let arrowSize = 3
    translate(vector.mag() * scale - arrowSize, 0)
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0)
    pop()
  }
}
