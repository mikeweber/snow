window.Snow.SnowFlake = (function() {
  function SnowFlake(x, y, z, options) {
    if (!options) options = {}
    this.x             = x
    this.y             = y
    this.z             = z
    this.velocity      = { x: 10, y: -62 }
    this.acceleration  = { x: 0, y: 0 }
    this.theta         = 2 * Math.PI * Math.random() // angular displacement
    this.omega         = 1 // angular velocity
    this.alpha         = 0 // angular acceleration
    this.forces        = []
    this.resetForce()
    this.mass          = 0.003
  }

  (function(klass) {
    klass.prototype.appendForce = function(force) {
      this.forces.push(force)
    }

    klass.prototype.step = function(dt) {
      this.applyForces()
      this.applyAcceleration(dt)
      var delta = this.calcDelta(dt)

      this.x     += delta.x
      this.y     += delta.y
      this.theta += delta.theta
      return false
    }

    klass.prototype.applyForces = function() {
      this.resetForce()
      var force
      for (var i = this.forces.length; i--; ) {
        force = this.forces[i].applyForce(this)
        this.active_forces.push(force)
      }

      for (var i = this.active_forces.length; i--; ) {
        this.force.x += this.active_forces[i].x
        this.force.y += this.active_forces[i].y
        if (this.active_forces[i].T) this.force.T += this.active_forces[i].T
      }
    }

    // F = ma
    // a = F / m
    // I = moment of inertia (for snowflake spinning around its center) = 1 / 12 * (m * r ^ 2)
    // alpha = Angular acceleration = T / I
    klass.prototype.applyAcceleration = function(dt) {
      this.acceleration.x = this.force.x / this.mass
      this.acceleration.y = this.force.y / this.mass
      var I = this.mass * this.radius() ** 2 / 12
      this.alpha += this.force.T / I

      this.velocity.x += this.acceleration.x * dt
      this.velocity.y += this.acceleration.y * dt
      this.omega += this.alpha * dt
    }

    klass.prototype.getPosition = function() {
      return {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    klass.prototype.resetForce = function() {
      this.active_forces = []
      this.force = { x: 0, y: 0, T: 0 }
    }

    klass.prototype.getCoefficient = function() {
      return 0.1
    }

    klass.prototype.getSurfaceArea = function() {
      return 0.0007
    }

    klass.prototype.getVelocity = function() {
      return this.velocity
    }

    klass.prototype.calcDelta = function(dt) {
      return {
        x:     this.velocity.x * dt,
        y:     this.velocity.y * dt,
        theta: this.omega * dt
      }
    }

    klass.prototype.detectCollision = function(fallen_flakes, dt, float_distance) {
      var earliest_collision = dt,
          closest_flake,
          potential_intersects = fallen_flakes.nearbyFlakes(this.x, this.x + float_distance)

      for (var i = 0; !closest_flake && i < potential_intersects.length; i++) {
        var flake = potential_intersects[i].flake,
        collision_time = this.collisionTimeWith(flake, fallen_flakes.stickiness())
        if (collision_time < dt && collision_time < earliest_collision) {
          earliest_collision = collision_time
          closest_flake = flake
        }
      }

      return { closest_flake: closest_flake, collision_time: earliest_collision }
    }

    klass.prototype.collisionTimeWith = function(flake, stickiness) {
      return (2 * -stickiness + flake.y - this.y) / this.velocity.y
    }

    klass.prototype.top = function() {
      return this.y - this.radius()
    }

    klass.prototype.radius = function() {
      return 1
    }
  })(SnowFlake)

  return SnowFlake
})()

