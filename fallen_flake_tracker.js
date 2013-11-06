window.Snow.FallenFlakeTracker = (function() {
  function FallenFlakeTracker(canvas_width, canvas_height) {
    this.flakes_by_x = {}
    this.flakes_by_y = {}
    this.length = 0
    this.canvas_width  = canvas_width
    this.canvas_height = canvas_height
    this.min_height    = this.canvas_height
    this.max_height    = this.canvas_height
  }

  (function(klass) {
    klass.stickiness = 2

    klass.prototype.stickiness = function() {
      return klass.stickiness
    }

    klass.prototype.snowCover = function() {
      return this.max_height - klass.stickiness
    }

    klass.prototype.prune = function(flake_renderer) {
      var flake   = flake_renderer.flake,
          key_x   = Math.floor(flake.x),
          key_y   = Math.floor(flake.top()),
          index_x = this.flakes_by_x[key_x].flakes.indexOf(flake_renderer),
          index_y = this.flakes_by_y[key_y].flakes.indexOf(flake_renderer)

      if (index_x >= 0) {
        this.flakes_by_x[key_x].flakes.splice(index_x, 1)
      }
      if (index_y >= 0){
        this.flakes_by_y[key_y].flakes.splice(index_y, 1)
        this.flakes_by_y[key_y].length--
      }
      if (index_x >= 0 && index_y >= 0) this.length--
    }

    klass.prototype.addFlake = function(flake_renderer) {
      this.length++
      var flake   = flake_renderer.flake,
          index_x = Math.floor(flake.x),
          index_y = Math.floor(flake.top())

      this.addFlakeToX(index_x, flake_renderer)
      this.addFlakeToY(index_x, index_y, flake_renderer)

      if (index_y < this.min_height) {
        this.setMinHeight(index_y)
      }
      if (index_y < this.max_height && this.isRowFull(index_y)) {
        this.setMaxHeight(index_y)
      }
    }

    klass.prototype.addFlakeToX = function(x, flake_renderer) {
      this.initializeFlakesByX(x)
      this.flakes_by_x[x].flakes.push(flake_renderer)
      if (flake_renderer.flake.top() < this.flakes_by_x[x].min_height) this.flakes_by_x[x].min_height = flake_renderer.flake.top()
    }

    klass.prototype.initializeFlakesByX = function(x) {
      if (!this.flakes_by_x[x]) this.flakes_by_x[x] = { flakes: [], min_height: this.canvas_height }
    }

    klass.prototype.addFlakeToY = function(x, y, flake_renderer) {
      this.initializeFlakesByY(y)
      if (!this.flakes_by_y[y].flakes[x] || this.flakes_by_y[y].flakes[x].flake.radius() < flake_renderer.flake.radius()) {
        // if a flake exists near the same x and y coords, keep the larger one
        if (this.flakes_by_y[y].flakes[x]) this.prune(this.flakes_by_y[y].flakes[x])
        this.flakes_by_y[y].flakes[x] = flake_renderer
        this.flakes_by_y[y].length++
      }
    }

    klass.prototype.initializeFlakesByY = function(y) {
      if (!this.flakes_by_y[y]) this.flakes_by_y[y] = { flakes: [], length: 0 }
    }

    klass.prototype.setMinHeight = function(new_min) {
      this.min_height = new_min
    }

    klass.prototype.setMaxHeight = function(new_max) {
      this.max_height = new_max
      this.pruneHiddenFlakes()
    }

    klass.prototype.isRowFull = function(y) {
      return this.flakes_by_y[y].length >= this.canvas_width
    }

    klass.prototype.pruneHiddenFlakes = function() {
      // Prune flakes off the screen
      for (var key in this.flakes_by_x) {
        if (key < 0 || this.canvas_width < key) {
          var flakes_to_remove = this.flakes_by_x[key]
          var flake_renderer
          while (flake_renderer = flakes_to_remove.flakes.pop()) {
            this.prune(flake_renderer)
          }
        }
      }

      // Prune flakes beneath the snow cover
      for (var key in this.flakes_by_y) {
        if (key >= this.max_height) {
          var flakes_to_remove = this.flakes_by_y[key].flakes
          for (var flake_renderer_key in flakes_to_remove) {
            flake_renderer = flakes_to_remove[flake_renderer_key]
            if (flake_renderer.flake.top() > this.max_height) this.prune(flake_renderer)
          }
        }
      }
    }

    klass.prototype.isFlakeHidden = function(flake) {
      return (flake.y - flake.radius()) > this.min_height
    }

    klass.prototype.nearbyFlakes = function(min, max) {
      if (!max) max = min
      max = Math.floor(max + klass.stickiness)
      min = Math.floor(min - klass.stickiness)

      var flakes = []
      for (var i = min; i < max; i++) {
        var nearby_flakes = this.get(i) || []
        flakes = flakes.concat(nearby_flakes)
      }

      return flakes
    }

    klass.prototype.get = function(i) {
      if (!this.flakes_by_x[i]) return []
      return this.flakes_by_x[i].flakes || []
    }

    klass.prototype.getAll = function() {
      var flakes = []
      for (var key in this.flakes_by_x) {
        var local_flakes = this.get(key)
        for (var i = 0; i < local_flakes.length; i++) {
          flakes.push(local_flakes[i])
        }
      }

      return flakes
    }
  })(FallenFlakeTracker)

  return FallenFlakeTracker
})()
