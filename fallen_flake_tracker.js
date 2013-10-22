window.Snow.FallenFlakeTracker = (function() {
  function FallenFlakeTracker() {
    this.fallen_flakes = {}
    this.length = 0
    this.min_height = canvas.height
    this.max_height = canvas.height
  }

  (function(klass) {
    klass.prototype.getMinHeight = function() {
      return Array.max(this.getMinHeights())
    }

    klass.prototype.getMinHeights = function() {
      var heights = []
      for (var key in this.fallen_flakes) {
        heights.push(this.fallen_flakes.min_height)
      }
      return heights
    }

    klass.prototype.prune = function(flake) {
      var key = Math.floor(flake.x),
          index = this.fallen_flakes[key].flakes.indexOf(flake)

      this.fallen_flakes[key].flakes.splice(index, 1)
      this.length--
    }

    klass.prototype.addFlake = function(flake) {
      this.length++
      var index = Math.floor(flake.x)
      if (!this.fallen_flakes[index]) this.fallen_flakes[index] = { flakes: [], min_height: canvas.height }
      this.fallen_flakes[index].flakes.push(flake)
      if (flake.y < this.fallen_flakes[index].min_height) this.fallen_flakes[index].min_height = flake.y
      if (flake.y < this.min_height) this.setMinHeight(flake.y)
    }

    klass.prototype.setMinHeight = function(new_min) {
      this.min_height = new_min
      this.pruneHiddenFlakes()
    }

    klass.prototype.pruneHiddenFlakes = function() {
      for (var key in this.fallen_flakes) {
        var nearby_flakes = this.get(key)
        for (var i = 0; i < nearby_flakes.length; i++) {
          var flake = nearby_flakes[i]
          if (this.isFlakeHidden(flake)) this.prune(flake)
        }
      }
    }

    klass.prototype.isFlakeHidden = function(flake) {
      return (flake.y - flake.radius()) > this.min_height
    }

    klass.prototype.nearbyFlakes = function(x) {
      var flakes = []
      for (var i = x - klass.stickiness; i < x + klass.stickiness; i++) {
        var nearby_flakes = this.get(i) || []
        flakes = flakes.concat(nearby_flakes)
      }

      return flakes
    }

    klass.prototype.get = function(i) {
      return this.fallen_flakes[i].flakes
    }

    klass.prototype.getAll = function() {
      var flakes = []
      for (var key in this.fallen_flakes) {
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
