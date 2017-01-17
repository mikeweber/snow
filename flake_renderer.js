window.Snow.SnowFlakeRenderer = (function() {
  function FlakeRenderer(context, flake, options) {
    if (!options) options = {}
    this.ctx   = context
    this.flake = flake
    this.color = (options.color || '#FFFFFF')
  }

  (function(klass) {
    klass.prototype.render = function(camera, min, max) {
      var pos3d = this.flake.getPosition()
      pos3d.y = (max.y + min.y) - pos3d.y
      var pos2d = this.convertPos2d(pos3d)
      var matrix_pos2d = camera.project(pos3d)
      if ((min.x > pos2d.x || max.y < pos2d.x) && (min.y > pos2d.y || max.y < pos2d.y)) return false

      matrix_pos2d.z = pos3d.z
      this.draw(matrix_pos2d, this.color)
      return true
    }

    klass.prototype.draw = function(pos, color) {
      this.ctx.beginPath()
      this.ctx.arc(pos.x, pos.y, this.flake.radius() / Math.abs(pos.z), 0, 2 * Math.PI, false)
      this.ctx.fillStyle = color
      this.ctx.fill()
      this.ctx.closePath()

      return true
    }

    klass.prototype.step = function(dt) {
      this.flake.step(dt)
    }

    klass.prototype.convertPos2d = function(pos) {
      return { x: pos.x / pos.z, y: pos.y / pos.z, z: pos.z }
    }
  })(FlakeRenderer)

  return FlakeRenderer
})()

