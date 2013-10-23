window.Snow.SnowDebugger = (function() {
  function SnowDebugger() {
    this.def_list = document.createElement('dl')
    this.def_list.setAttribute('id', 'debug')
    this.nodes = {}

    this.addTracker('Flake Size')
    this.addTracker('Fallen Flake Size')
    this.addTracker('FPS')
    this.addTracker('Min Height')

    document.body.appendChild(this.def_list)
  }

  (function(klass) {
    klass.prototype.addTracker = function(title) {
      var dt = document.createElement('dt')
      var dd = document.createElement('dd')
      this.nodes[title] = dd

      dt.appendChild(document.createTextNode(title))
      dd.appendChild(document.createTextNode(''))

      this.def_list.appendChild(dt)
      this.def_list.appendChild(dd)
    }

    klass.prototype.updateStats = function(renderer) {
      this.updateFlakeLength(renderer)
      this.updateFallenFlakeLength(renderer)
      this.updateFPS(renderer)
      this.updateMinHeight(renderer)
    }

    klass.prototype.updateFlakeLength = function(renderer) {
      this.nodes['Flake Size'].innerHTML = renderer.flakes.length
    }

    klass.prototype.updateFallenFlakeLength = function(renderer) {
      this.nodes['Fallen Flake Size'].innerHTML = renderer.fallen_flakes.length
    }

    klass.prototype.updateFPS = function(renderer) {
      this.nodes['FPS'].innerHTML = Math.round(1000 / this.fps(renderer))
    }

    klass.prototype.fps = function(renderer) {
      var dt = new Date() - renderer.last_draw
      if (!this.weighted_dt) {
        this.weighted_dt = dt
      } else {
        this.weighted_dt = this.weighted_dt * 0.9 + dt * 0.1
      }

      return this.weighted_dt
    }

    klass.prototype.updateMinHeight = function(renderer) {
      this.nodes['Min Height'].innerHTML = renderer.fallen_flakes.snowCover()
    }
  })(SnowDebugger)

  return SnowDebugger
})()

