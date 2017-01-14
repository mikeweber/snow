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


    var Fx = this.calcForce(C, p, A * Math.abs(Math.sin(entity.theta)), (wind_velocity.x - v.x))
    var Fy = this.calcForce(C, p, A * Math.abs(Math.cos(entity.theta)), (wind_velocity.y - v.y))
    // Now that we know the X and Y forces, also apply a tangential force that may lift or push down the snow flak
    // Fy += Math.sin(entity.theta - Math.PI) * Fx
    // Fx += Math.abs(Math.cos(entity.theta - Math.PI)) * Fy
    var T = 0

    return {
      x: Fx,
      y: Fy,
      T: T
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

  // T = torque = F * r
  klass.prototype.calcRotationalForce = function(radius, theta, mass, x_force, y_force) {
    // cos(theta) * radius == leverage of wind in x axis
    // sin(theta - 90º) == x-axis leverage that is perpendicular to lever
    // sin(theta) * radius == leverage of wind in y axis
    //
    var I  = mass * radius ** 2 / 12
    var Tx = x_force * radius * Math.cos(theta) * Math.sin(theta - Math.PI / 2)
    var Ty = y_force * radius * Math.sin()
  }

  klass.prototype.getVelocity = function(pos) {
    //if (this.getLeft() < pos.x && pos.x < this.getRight()) {
      return this.velocity
    //} else {
      //return { x: 0, y: 0 }
    //}
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

