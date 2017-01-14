window.Snow.SnowDebugger = (function() {
  function SnowDebugger() {
    this.def_list = document.createElement('dl')
    this.def_list.setAttribute('id', 'debug')
    this.nodes = {}

    this.addTracker('Flake Size', updateFlakeLength)
    this.addTracker('FPS', updateFPS)

    document.body.appendChild(this.def_list)
  }

  function updateFlakeLength(node, renderer) {
    node.innerHTML = renderer.renderers.length
  }

  function updateFPS(node, renderer) {
    node.innerHTML = Math.round(1000 / fps(renderer))
  }

  function fps(renderer) {
    var dt = new Date() - renderer.last_draw
    if (!this.weighted_dt) {
      this.weighted_dt = dt
    } else {
      this.weighted_dt = this.weighted_dt * 0.9 + dt * 0.1
    }

    return this.weighted_dt
  }

  (function(klass) {
    klass.prototype.addTracker = function(title, callback) {
      var dt = document.createElement('dt')
      var dd = document.createElement('dd')
      this.nodes[title] = { node: dd, callback: callback }

      dt.appendChild(document.createTextNode(title))
      dd.appendChild(document.createTextNode(''))

      this.def_list.appendChild(dt)
      this.def_list.appendChild(dd)
    }

    klass.prototype.updateStats = function(renderer) {
      for (var node_name in this.nodes) {
        var node = this.nodes[node_name]
        node.callback(node.node, renderer)
      }
    }
  })(SnowDebugger)

  return SnowDebugger
})()

