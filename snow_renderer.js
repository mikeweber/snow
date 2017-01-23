window.Snow.Renderer = (function() {
  function Renderer(canvas, width, height, camera, options) {
    if (!options) options = {}
    this.canvas        = canvas
    this.ctx           = this.canvas.getContext('2d')
    this.canvas.width  = width
    this.canvas.height = height
    this.camera        = camera
    this.last_draw     = 0
    // default frame rate to 60 fps
    this.frame_length  = options.frame_length || 16
    if (options.wind)    this.wind    = options.wind
    if (options.gravity) this.gravity = options.gravity
    if (options.debug)   this.debug   = options.debug
    if (options.toggler) this.toggler = new options.toggler(this)
    this.renderers     = []
    // this.addSnowFlakeRenderer(this.createSnowFlake(0,  0, 0), { color: '#FF0000' })
    // this.addSnowFlakeRenderer(this.createSnowFlake(0, -10, 0), { color: '#00FF00' })
    // this.addSnowFlakeRenderer(this.createSnowFlake(1,  0, 0), { color: '#FFFFFF' })
    // this.addSnowFlakeRenderer(this.createSnowFlake(1,  1, 0), { color: '#0000FF' })
    // this.addSnowFlakeRenderer(this.createSnowFlake(1,  1, 5), { color: '#FFFFFF' })
    // this.addSnowFlakeRenderer(this.createSnowFlake(0.9,0.9,0.9), { color: '#FF00FF' })
    for (var i = 0; i < 1000; i++) {
      this.addSnowFlakeRenderer(this.generateStartingSnowFlake(1)[0])
    }
  }

  (function(klass) {
    klass.prototype.addSnowFlakeRenderer = function(flake, options) {
      this.renderers.push(new Snow.SnowFlakeRenderer(this.ctx, flake, options))
    }

    klass.prototype.drawSnowFlakes = function(camera) {
      for (var i = this.renderers.length; i--; ) {
        if (!this.drawSnowFlake(camera, this.renderers[i])) {
          this.renderers.splice(i, 1)
        }
      }
    }

    klass.prototype.drawSnowFlake = function(camera, renderer) {
      return renderer.render(camera)
    }

    klass.prototype.updateSnowFlakes = function(dt) {
      if (this.wind) this.wind.step(dt)

      for (var i = this.renderers.length; i--; ) {
        this.renderers[i].step(dt)
      }

      this.addSnowFlakes(Math.random() * 2)
    }

    klass.prototype.addSnowFlakes = function(new_flake_count) {
      for (var i = 0; i < new_flake_count; i++) this.addSnowFlake()
    }

    klass.prototype.addSnowFlake = function() {
      this.addSnowFlakeRenderer(this.generateSnowFlake())
    }

    klass.prototype.generateSnowFlake = function() {
      // Start the snowflake somewhere on the canvas, or just off the edge of either side
      var starting_point = (Math.random() * this.canvas.width * 1.1) - this.canvas.width * 0.05
      var starting_height = this.canvas.height
      if (Math.random() < 0.2) {
        starting_point  = -10
        starting_height = Math.random() * this.canvas.height
      }
      // Add some depth, but for performance reasons, try to keep flakes at a medium depth
      // so they are removed from the screen at about the same rate that they're added
      var depth = Math.abs(Math.rnd(1, 0.3))
      return this.createSnowFlake(starting_point, starting_height, depth)
    }

    klass.prototype.generateStartingSnowFlake = function(flake_count) {
      var flakes = []
      for (var i = 0; i < flake_count; i++) {
        var start_x = Math.random() * this.canvas.width
        var start_y = Math.random() * this.canvas.height
        var depth = Math.rnd(1, 0.3)
        flakes.push(this.createSnowFlake(start_x, start_y, depth))
      }
      return flakes
    }

    klass.prototype.createSnowFlake = function(x, y, z) {
      var flake = new Snow.SnowFlake(x, y, z)
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
          this.clearCanvas()
          this.drawSnowFlakes(this.camera)
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

