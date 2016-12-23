window.Snow.SnowFlake = (function() {
  function SnowFlake(x, y, z, options) {
    if (!options) options = {}
    this.x            = x
    this.y            = y
    this.z            = z
    this.velocity     = { x: 10, y: 62 }
    this.acceleration = { x: 0, y: 0 }
    this.float        = options.float || Math.PI * 2 * Math.random()
    this.forces       = []
    this.current_forces = []
    this.mass         = 0.005
  }

  (function(klass) {
    klass.prototype.appendForce = function(force) {
      this.forces.push(force)
    }

    klass.prototype.step = function(dt) {
      // change float first since this is used to calculate velocity y
      this.float += Math.PI / 20 * dt
      this.applyForces()
      this.applyAcceleration(dt)
      var delta = this.calcDelta(dt)

      this.x += delta.x
      this.y += delta.y
      return false
    }

    klass.prototype.applyForces = function() {
      this.resetForce()
      var force
      for (var i = this.forces.length; i--; ) {
        force = this.forces[i].applyForce(this)
        this.current_forces.push(force)
        this.force.x += force.x
        this.force.y += force.y
      }
    }

    // F = ma
    // a = F / m
    klass.prototype.applyAcceleration = function(dt) {
      this.acceleration.x = this.force.x / this.mass
      this.acceleration.y = this.force.y / this.mass

      this.velocity.x += this.acceleration.x * dt
      this.velocity.y -= this.acceleration.y * dt
    }

    klass.prototype.getPosition = function() {
      return {
        x: this.x,
        y: this.y,
        z: this.z
      }
    }

    klass.prototype.resetForce = function() {
      this.current_forces = []
      this.force = { x: 0, y: 0 }
    }

    klass.prototype.getCoefficient = function() {
      return 0.1
    }

    klass.prototype.getSurfaceArea = function() {
      return 0.00005
    }

    klass.prototype.getVelocity = function() {
      return this.velocity
    }

    klass.prototype.calcDelta = function(dt) {
      return {
        x: this.velocity.x * dt,
        y: this.velocity.y * dt
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

