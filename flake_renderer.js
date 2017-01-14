window.Snow.SnowFlakeRenderer = (function() {
  function FlakeRenderer(context, flake, options) {
    if (!options) options = {}
    this.ctx   = context
    this.flake = flake
    this.color = (options.color || '#FFFFFF')
  }

  (function(klass) {
    klass.prototype.render = function(min, max) {
      var pos3d = this.flake.getPosition()
      pos3d.y = (max.y + min.y) - pos3d.y
      var pos2d = this.convertPos2d(pos3d)
      if ((min.x > pos2d.x || max.y < pos2d.x) && (min.y > pos2d.y || max.y < pos2d.y)) return false

      this.ctx.beginPath()
      this.ctx.strokeStyle = '#FF0000'
      this.ctx.arc(pos2d.x, pos2d.y, this.flake.radius() / pos3d.z, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = this.color
      this.ctx.fill()
      this.ctx.closePath()
//       this.ctx.stroke()
// 
//       this.ctx.beginPath()
//       var topleft_x     = Math.cos(this.flake.theta) * this.flake.radius() / pos3d.z + pos2d.x
//       var topleft_y     = Math.sin(this.flake.theta) * this.flake.radius() / pos3d.z + pos2d.y
//       var bottomright_x = Math.cos(this.flake.theta + Math.PI) * this.flake.radius() / pos3d.z + pos2d.x
//       var bottomright_y = Math.sin(this.flake.theta + Math.PI) * this.flake.radius() / pos3d.z + pos2d.y
//       this.ctx.moveTo(topleft_x, topleft_y)
//       this.ctx.lineTo(bottomright_x, bottomright_y)
//       this.ctx.strokeStyle = this.color
//       this.ctx.lineWidth = pos3d.z
//       this.ctx.closePath()
//       this.ctx.stroke()

      return true
    }

    klass.prototype.step = function(dt) {
      this.flake.step(dt)
    }

    klass.prototype.convertPos2d = function(pos) {
      return { x: pos.x / pos.z, y: pos.y / pos.z }
    }
  })(FlakeRenderer)

  return FlakeRenderer
})()

