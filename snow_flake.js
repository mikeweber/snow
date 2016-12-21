window.Snow.SnowFlake = (function() {
  function SnowFlake(x, y, z, options) {
    if (!options) options = {}
    this.x = x
    this.y = y
    this.z = z
    this.vel_x = 0
    this.float = options.float || Math.PI * 2 * Math.random()
    this.is_fallen = false
  }

  (function(klass) {
    klass.prototype.step = function(fallen_flakes, dt, wind) {
      if (this.is_fallen) return
      // change float first since this is used to calculate velocityY
      this.float += Math.PI / 20 * dt
      var delta          = this.calcDelta(fallen_flakes, dt, wind),
          fall_distance  = delta.y,
          float_distance = delta.x

      // If the flake has collided, or will collided between the last and the current frame
      // if (delta.steps_to_snowcover < 1) {
      //   // check to see if there is actual snow to intersect with before the "ground"
      //   var collision_flake = this.detectCollision(fallen_flakes, dt, float_distance)
      //   if (collision_flake.closest_flake) {
      //     delta.steps_to_snowcover = collision_flake.collision_time
      //   }

      //   // only fall and float by the percentage of time between the previous and the current frame
      //   fall_distance  *= delta.steps_to_snowcover
      //   float_distance *= delta.steps_to_snowcover
      //   this.is_fallen  = true
      // }

      this.y += fall_distance
      this.x += float_distance

      return this.is_fallen
    }

    klass.prototype.calcDelta = function(fallen_flakes, dt, wind) {
      // next determine where it's going to fall in this frame
      var fall_distance = this.velocityY() * dt,
          distance_from_snow_cover = (this.y + fall_distance) - fallen_flakes.snowCover(),
          steps_to_snowcover = (this.velocityY() - distance_from_snow_cover) / this.velocityY(),
          float_distance = this.stepVelocityX(dt, wind)

      float_distance += this.z * Math.sin(this.float) * 0.25
      return { x: float_distance, y: fall_distance, steps_to_snowcover : steps_to_snowcover }
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
      return (2 * -stickiness + flake.y - this.y) / this.velocityY()
    }

    klass.prototype.stepVelocityX = function(dt, wind) {
      if (wind) this.vel_x += wind.getSpeed(this.x, this.z) * dt
      this.vel_x *= 0.99

      return this.vel_x
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

