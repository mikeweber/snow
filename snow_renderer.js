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
    // default frame rate to 60 fps
    this.frame_length = options.frame_length || 16
    if (options.wind)    this.wind    = options.wind
    if (options.gravity) this.gravity = options.gravity
    if (options.debug)   this.debug   = options.debug
    if (options.toggler) this.toggler = new options.toggler(this)
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
      var max_height = this.fallen_flakes.snowCover()
      this.ctx.fillRect(0, max_height, this.canvas.width, this.canvas.height - max_height)
      // this.ctx.beginPath()
      // this.ctx.moveTo(0, max_height)
      // this.ctx.lineTo(this.canvas.width, max_height)
      // this.ctx.strokeStyle = '#222'
      // this.ctx.stroke()
    }

    klass.prototype.drawSnowFlake = function(flake) {
      flake.render()
    }

    klass.prototype.updateSnowFlakes = function(dt) {
      if (this.wind) this.wind.step(dt)

      var newly_fallen_indices = []
      for (var i = 0; i < this.flakes.length; i++) {
        // Flake#step will return true if there's a collision
        var removed = this.flakes[i].flake.step(dt)
        if (this.flakes[i].flake.y > this.canvas.height + 50) removed = true
        if (removed) newly_fallen_indices.push(i)
      }

      this.markFlakesAsFallen(newly_fallen_indices)
      this.fallen_flakes.pruneHiddenFlakes()

      this.addSnowFlakes(Math.random() * 5)
    }

    // Move the flakes at the passed in indices from the flakes array to the fallen_flakes tracker
    klass.prototype.markFlakesAsFallen = function(newly_fallen_indices) {
      var flake_index
      while (flake_index = newly_fallen_indices.pop()) {
        var flake = this.flakes[flake_index]
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

      var flake = new Snow.SnowFlake(starting_point, 0, depth)
      flake.appendForce(this.wind)
      flake.appendForce(this.gravity)

      return flake
    }

    klass.prototype.animateScreen = function() {
      this.last_draw = new Date()

      function render() {
        var now = new Date(),
            dt  = now - this.last_draw

        if (dt > this.frame_length) {
          this.updateSnowFlakes(dt * 0.001)
          this.fallen_flakes.pruneHiddenFlakes()
          this.clearCanvas()
          this.drawSnowFlakes()
          this.drawFallenFlakes()
          if (this.debug) this.debug.updateStats(this)
          this.last_draw = now
        }

        if (!this.toggler || this.toggler.running) requestAnimationFrame(render.bind(this))
      }
      requestAnimationFrame(render.bind(this))
    }

    klass.prototype.clearCanvas = function() {
      this.ctx.fillStyle = '#274EAB'
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

