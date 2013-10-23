window.Snow.Renderer = (function() {
  function Renderer(canvas, width, height, options) {
    if (!options) options = {}
    this.canvas        = canvas
    this.ctx           = this.canvas.getContext('2d')
    this.canvas.width  = width
    this.canvas.height = height
    this.last_draw     = 0
    this.flakes        = []
    this.fallen_flakes = new Snow.FallenFlakeTracker(this.canvas.width, this.canvas.height)
    if (options.wind)    this.wind    = options.wind
    if (options.debug)   this.debug   = options.debug
    if (options.toggler) this.toggler = options.toggler
  }

  (function(klass) {
    klass.prototype.drawSnowFlakes = function() {
      for (var i = 0; i < this.flakes.length; i++) {
        this.drawSnowFlake(this.flakes[i])
      }
    }

    klass.prototype.drawFallenFlakes = function() {
      var flakes = this.fallen_flakes.getAll()
      for (var i = 0; i < flakes.length; i++) {
        this.drawSnowFlake(flakes[i])
      }
      this.drawSnowCover()
    }

    klass.prototype.drawSnowCover = function() {
      this.ctx.fillStyle = '#FFF'
      var max_height = this.fallen_flakes.max_height
      this.ctx.fillRect(0, max_height, this.canvas.width, this.canvas.height - max_height)
    }

    klass.prototype.drawSnowFlake = function(flake) {
      flake.render()
    }

    klass.prototype.updateSnowFlakes = function(dt) {
      if (this.wind) this.wind.step(dt)

      var newly_fallen_indices = []
      for (var i = 0; i < this.flakes.length; i++) {
        // Flake#step will return true if there's a collision
        var removed = this.flakes[i].flake.step(this.fallen_flakes, dt)
        if (removed) newly_fallen_indices.push(i)
      }

      // Before removing flakes, reverse the order so that removing one flake doesn't
      // affect the removal of another flake later in the list
      this.markFlakesAsFallen(newly_fallen_indices.reverse())

      this.addSnowFlakes(Math.random() * 5)
    }

    // Move the flakes at the passed in indices from the flakes array to the fallen_flakes tracker
    klass.prototype.markFlakesAsFallen = function(newly_fallen_indices) {
      for (i = 0; i < newly_fallen_indices.length; i++) {
        var flake = this.flakes[newly_fallen_indices[i]]
        this.fallen_flakes.addFlake(flake)
        this.flakes.splice(this.flakes.indexOf(flake), 1)
      }
    }

    klass.prototype.addSnowFlakes = function(new_flake_count) {
      for (var i = 0; i < new_flake_count; i++) this.addSnowFlake()
    }

    klass.prototype.addSnowFlake = function() {
      this.flakes.push(new Snow.SnowFlakeRenderer(this.ctx, this.generateSnowFlake()))
    }

    klass.prototype.generateSnowFlake = function() {
      // Start the snowflake somewhere on the canvas, or just off the edge of either side
      var starting_point = (Math.random() * this.canvas.width * 1.1) - this.canvas.width * 0.05
      // Add some depth, but for performance reasons, try to keep flakes at a medium depth
      // so they are removed from the screen at about the same rate that they're added
      var depth = Math.abs(Math.rnd(2, 1))

      return new Snow.SnowFlake(starting_point, 0, depth)
    }

    klass.prototype.animateScreen = function(frame_length) {
      this.last_draw = new Date()
      var self = this
      function render() {
        var dt = new Date() - self.last_draw

        if (dt > frame_length) {
          self.updateSnowFlakes(dt * 0.001)
          self.clearCanvas()
          self.drawSnowFlakes()
          self.drawFallenFlakes()
          if (self.debug) self.debug.updateStats(self)
          self.last_draw = new Date()
        }

        if (!self.toggler || self.toggler.running) requestAnimationFrame(render)
      }
      requestAnimationFrame(render)
    }

    klass.prototype.clearCanvas = function() {
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

