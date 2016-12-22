window.Snow.SnowFlakeRenderer = (function() {
  function FlakeRenderer(context, flake, options) {
    if (!options) options = {}
    this.ctx   = context
    this.flake = flake
    this.color = (options.color || '#FFF')
  }

  (function(klass) {
    klass.prototype.render = function(min, max) {
      var pos3d = this.flake.getPosition()
      var pos2d = this.convertPos2d(pos3d)
      if ((min.x > pos2d.x || max.y < pos2d.x) && (min.y > pos2d.y || max.y < pos2d.y)) return false

      this.ctx.beginPath()
      this.ctx.arc(pos2d.x, pos2d.y, this.flake.radius() / pos3d.z, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = this.color
      this.ctx.fill()
      return true
    }

    klass.prototype.convertPos2d = function(pos) {
      return { x: pos.x / pos.z, y: pos.y / pos.z }
    }
  })(FlakeRenderer)

  return FlakeRenderer
})()

