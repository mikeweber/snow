window.Snow.SnowFlakeRenderer = (function() {
  function FlakeRenderer(context, flake, options) {
    if (!options) options = {}
    this.ctx   = context
    this.flake = flake
    this.color = (options.color || '#FFFFFF')
  }

  (function(klass) {
    klass.prototype.render = function(camera) {
      var pos3d = this.flake.getPosition()
      // pos3d.y = (max.y + min.y) - pos3d.y
      var pos2d  = camera.project(pos3d)
      if (!pos2d) return true

      // pos2d.z = pos3d.z
      this.draw(pos2d, this.color)
      return true
    }

    klass.prototype.draw = function(pos, color) {
      this.ctx.beginPath()
      var radius = this.flake.radius() / (Math.abs(pos.z) * 0.005)
      // radius = 5
      this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = color
      this.ctx.fill()
      this.ctx.closePath()

      return true
    }

    klass.prototype.step = function(dt) {
      this.flake.step(dt)
    }
  })(FlakeRenderer)

  return FlakeRenderer
})()

