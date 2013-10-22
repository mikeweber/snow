window.Snow.SnowFlake = (function() {
  function SnowFlake(x, y, z) {
    this.x = x
    this.y = 0
    this.z = z
    this.float = Math.PI * 2 * Math.random()
    this.is_fallen = false
  }

  (function(klass) {
    klass.stickiness = 2

    klass.prototype.step = function(dt, wind) {
      if (this.is_fallen) return
      if (this.detectCollision() || this.y >= canvas.height) {
        return true
      }
      this.y += 1 * this.z * dt * 0.1
      this.float += Math.PI * dt * 0.01
      if (wind) this.x += wind.direction * this.z * dt * 0.1
      this.x += Math.sin(this.float) * this.z * 0.2
    }

    klass.prototype.radius = function() {
      return this.z
    }

    klass.prototype.detectCollision = function(fallen_flakes, stickiness) {
      // If the flake is nowhere near the ground, don't bother with calculations
      if (this.y < fallen_flakes.getMinHeight() - stickiness) return false

      var collided = false
      var nearby_flakes = fallen_flakes.nearbyFlakes(this.x)

      for (var i = 0; !collided && i < nearby_flakes.length; i++) {
        var flake = nearby_flakes[i]
        if (flake !== this) {
          var dx = this.x - flake.x,
              dy = this.y - flake.y,
              radii = stickiness

          if (dx < stickiness && (dx * dx) + (dy * dy) < (radii * radii)) collided = true
        }
      }
      this.is_fallen = collided

      return collided
    }
  })(SnowFlake)

  return SnowFlake
})()

