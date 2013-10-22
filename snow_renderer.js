window.Snow.Renderer = (function() {
  function Renderer(canvas, width, height, options) {
    if (!options) options = {}
    this.canvas        = canvas
    this.ctx           = this.canvas.getContext('2d')
    this.canvas.width  = width
    this.canvas.height = height
    this.last_draw     = 0
    this.flakes        = []
    this.fallen_flakes = new Snow.FallenFlakeTracker()
    if (options.wind)  this.wind     = options.wind
    if (options.debug) this.debugger = options.debug
  }

  (function(klass) {
    klass.prototype.drawSnowFlakes = function() {
      for (var i = 0; i < flakes.length; i++) {
        this.drawSnowFlake(flakes[i])
      }
    }

    klass.prototype.drawFallenFlakes = function() {
      var flakes = fallen_flakes.getAll()
      for (var i = 0; i < flakes.length; i++) {
        this.drawSnowFlake(flakes[i], '#000')
      }
      this.drawSnowCover()
    }

    klass.prototype.drawSnowCover = function() {
      this.ctx.fillStyle = '#FFF'
      var min_height = this.fallen_flakes.getMinHeight()
      this.ctx.fillRect(0, min_height, this.canvas.width, this.canvas.height - min_height)
    }

    klass.prototype.drawSnowFlake = function(flake) {
      flake.render()
    }

    klass.prototype.updateSnowFlakes = function() {
      var dt = (new Date() - this.last_draw) * 0.001

      if (this.wind) this.wind.step(dt)

      var newly_fallen_indices = []
      for (var i = 0; i < flakes.length; i++) {
        // Flake#step will return true if there's a collision
        if (flakes[i].step(dt)) newly_fallen_indices.push(i)
      }

      // Before removing flakes, reverse the order so that removing one flake doesn't
      // affect the removal of another flake later in the list
      this.markFlakesAsFallen(newly_fallen_indices.reverse())

      this.addSnowFlakes(Math.random() * 5)
    }

    // Move the flakes at the passed in indices from the flakes array to the fallen_flakes tracker
    klass.prototype.markFlakesAsFallen = function(newly_fallen_indices) {
      for (i = 0; i < newly_fallen_indices.length; i++) {
        var flake = flakes[newly_fallen_indices[i]]
        this.fallen_flakes.addFlake(flake)
        this.flakes.splice(this.flakes.indexOf(flake), 1)
      }
    }

    klass.prototype.addSnowFlakes = function(new_flake_count) {
      for (var i = 0; i < new_flake_count; i++) addSnowFlake()
    }

    klass.prototype.addSnowFlake = function() {
      flakes.push(new Snow.SnowFlakeRenderer(this.ctx, this.generateSnowFlake()))
    }

    klass.prototype.generateSnowFlake = function() {
      // Start the snowflake somewhere on the canvas, or just off the edge of either side
      var starting_point = (Math.random() * this.canvas.width * 1.1) - canvas.width * 0.05
      // Add some depth, but for performance reasons, try to keep flakes at a medium depth
      // so they are removed from the screen at about the same rate that they're added
      var depth = Math.abs(Math.rnd(2, 1))

      return new Snow.SnowFlake(starting_point, 0, depth)
    }

    klass.prototype.animateScreen = function(frame_length) {
      this.last_draw = new Date()
      function step() {
        if (new Date() - this.last_draw > frame_length) {
          this.updateSnowFlakes()
          this.clearCanvas()
          this.drawSnowFlakes()
          this.drawFallenFlakes()
          this.last_draw = new Date()
          if (this.debug) debug.updateStats()
        }

        if (!this.toggler || this.toggler.running) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }

    function clearCanvas() {
      this.ctx.fillStyle = '#87ceeb'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
  })(Renderer)

  function requestAnimationFrame(fn) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
          setTimeout(callback, 1)
        }
    }
    window.requestAnimationFrame(fn)
  }

  return Renderer
})()

