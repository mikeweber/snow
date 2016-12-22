window.Snow.SnowFlakeRenderer = (function() {
  function FlakeRenderer(context, flake, options) {
    if (!options) options = {}
    this.ctx   = context
    this.flake = flake
    this.color = (options.color || '#FFF')
  }

  (function(klass) {
    klass.prototype.render = function() {
      this.ctx.beginPath()
      var pos3d = this.flake.getPosition()
      var pos2d = this.convertPos2d(pos3d)
      this.ctx.arc(pos2d.x, pos2d.y, this.flake.radius() / pos3d.z, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = this.color
      this.ctx.fill()
    }

    klass.prototype.convertPos2d = function(pos) {
      return { x: pos.x / pos.z, y: pos.y / pos.z }
    }
  })(FlakeRenderer)

  return FlakeRenderer
})()

