window.Snow.Wind = (function() {
  var klass = function Wind(position, speed, window_width) {
    this.position = position
    this.window_width = window_width
    this.width = 600
    this.edge_width = 200
    this.velocity = { x: speed, y: 0 }
  }

  klass.prototype.step = function(dt) {
    this.position += dt * this.velocity.x * 100
    if (this.getLeftEdge() > this.window_width) this.position = -(this.width + this.edge_width)
  }

  klass.prototype.applyForce = function(entity) {
    var C = entity.getCoefficient(),
        p = 1,
        A = entity.getSurfaceArea(),
        v = entity.getVelocity(),
        wind_velocity = this.getVelocity(entity.getPosition())
    return {
      x: this.calcForce(C, p, A, (v.x - wind_velocity.x)),
      y: this.calcForce(C, p, A, (v.y - wind_velocity.y))
    }
  }

  // http://www.real-world-physics-problems.com/drag-force.html
  // C = Drag coefficient
  // p = air density
  // A = Cross-section surface area
  // v = velocity
  klass.prototype.calcForce = function(C, p, A, v) {
    return C * p * A * v * v * 0.5
  }

  klass.prototype.getVelocity = function(pos) {
    if (this.getLeftEdge() < pos.x && pos.x < this.getRightEdge()) {
      return this.velocity
    } else {
      return { x: 0, y: 0 }
    }
  }

  klass.prototype.getLeftEdge = function() {
    return this.getLeft() - this.edge_width
  }

  klass.prototype.getRightEdge = function() {
    return this.getRight() + this.edge_width
  }

  klass.prototype.getLeft = function() {
    return this.position - this.width
  }

  klass.prototype.getRight = function() {
    return this.position + this.width
  }

  return klass
})()

