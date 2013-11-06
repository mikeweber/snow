window.Snow.SnowFlake = (function() {
  function SnowFlake(x, y, z) {
    this.x = x
    this.y = 0
    this.z = z
    this.float = Math.PI * 2 * Math.random()
    this.is_fallen = false
  }

  (function(klass) {
    klass.prototype.step = function(fallen_flakes, dt, wind) {
      if (this.is_fallen) return
      if (this.detectCollision(fallen_flakes) || this.y >= fallen_flakes.snowCover()) {
        this.is_fallen = true
        return true
      }
      this.y += 1 * this.z * dt * 100
      this.float += Math.PI * dt
      if (wind) this.x += wind.direction * this.z * dt * 0.1
      this.x += Math.sin(this.float) * this.z * 0.2
    }

    klass.prototype.calcDelta = function(fallen_flakes, dt, wind) {
      // next determine where it's going to fall in this frame
      var fall_distance = this.velocityY() * dt,
          distance_from_snow_cover = (this.y + fall_distance) - fallen_flakes.snowCover(),
          steps_to_snowcover = (this.velocityY() - distance_from_snow_cover) / this.velocityY(),
          float_distance = this.velocityX(wind)

      return { x: float_distance, y: fall_distance, steps_to_snowcover : steps_to_snowcover }
    }

    klass.prototype.detectCollision = function(fallen_flakes) {
      // If the flake is nowhere near the ground, don't bother with calculations
      if (this.y < fallen_flakes.snowCover() - 1) return false

      var collided = false
      var nearby_flakes = fallen_flakes.nearbyFlakes(this.x)

      for (var i = 0; !collided && i < nearby_flakes.length; i++) {
        var flake = nearby_flakes[i]
        if (flake !== this) {
          var dx = this.x - flake.x,
              dy = this.y - flake.y,
              radii = fallen_flakes.stickiness

          if (dx < fallen_flakes.stickiness && (dx * dx) + (dy * dy) < (radii * radii)) collided = true
        }
      }

      return { closest_flake: closest_flake, collision_time: earliest_collision }
    }

    klass.prototype.collisionTimeWith = function(flake, stickiness) {
      return (2 * -stickiness + flake.y - this.y) / this.velocityY()
    }

    klass.prototype.velocityX = function(wind) {
      var vel_x = this.z * Math.sin(this.float) * 0.5
      if (wind) vel_x += wind.direction

      return vel_x
    }

    klass.prototype.velocityY = function() {
      return this.z * 100
    }

    klass.prototype.top = function() {
      return this.y - this.radius()
    }

    klass.prototype.radius = function() {
      return this.z
    }
  })(SnowFlake)

  return SnowFlake
})()

