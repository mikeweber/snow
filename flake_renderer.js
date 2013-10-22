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
      this.ctx.arc(this.flake.x, this.flake.y, this.flake.radius(), 0, 2 * Math.PI, false)
      ctx.fillStyle = this.color
      ctx.fill()
    }
  })(FlakeRenderer)

  return FlakeRenderer
})()

