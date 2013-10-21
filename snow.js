(function() {
  var canvas = document.getElementById('snow'),
      ctx    = canvas.getContext('2d')
  canvas.width = 1000
  canvas.height = 800
  var flakes = [],
      fallen_flakes = new FallenFlakeTracker(),
      wind   = new Wind(0),
      debug = new LocalDebugger()

  function drawSnowFlakes() {
    for (var i = 0; i < flakes.length; i++) {
      drawSnowFlake(flakes[i])
    }
  }

  function drawFallenFlakes() {
    var flakes = fallen_flakes.getAll()
    for (var i = 0; i < flakes.length; i++) {
      drawSnowFlake(flakes[i])
    }
    drawSnowCover()
  }

  function drawSnowCover() {
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, fallen_flakes.min_height, canvas.width, canvas.height - fallen_flakes.min_height)
  }

  function drawSnowFlake(flake) {
    ctx.beginPath()
    ctx.arc(flake.x, flake.y, flake.radius(), 0, 2 * Math.PI, false)
    ctx.fillStyle = '#FFF'
    ctx.fill()
  }

  function updateSnowFlakes() {
    wind.step()
    for (var i = 0; i < flakes.length; i++) {
      flakes[i].step()
    }

    var new_flake_count = Math.random() * 5
    for (var i = 0; i < new_flake_count; i++) {
      addSnowFlake()
    }
  }

  function addSnowFlake() {
    var starting_point = (Math.random() * canvas.width * 1.1)
    starting_point = starting_point - canvas.width * 0.05
    var depth = (Math.rnd_snd()) * 2
    flakes.push(new SnowFlake(starting_point, 0, depth))
  }

  function animateScreen() {
    function step() {
      clearCanvas()
      updateSnowFlakes()
      drawFallenFlakes()
      drawSnowFlakes()
      debug.updateStats()

      requestAnimationFrame()(step)
    }
    requestAnimationFrame()(step)
  }

  function clearCanvas() {
    ctx.fillStyle = '#87ceeb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function SnowFlake(x, y, z) {
    this.x = x
    this.y = 0
    this.z = z
    this.float = Math.PI * 2 * Math.random()
    this.is_fallen = false
  }

  SnowFlake.prototype.step = function() {
    if (this.is_fallen) return
    if (this.detectCollision() || this.y >= canvas.height) {
      this.flakeIsFallen()
      return
    }

    this.y += 1 * this.z
    this.float += Math.PI / 90
    // this.x += wind.direction * this.z * 0.1
    this.x += Math.sin(this.float) * this.z * 0.2
  }

  SnowFlake.prototype.radius = function() {
    return this.z
  }

  SnowFlake.prototype.detectCollision = function() {
    // If the flake is nowhere near the ground, don't bother with calculations
    if (this.y < fallen_flakes.min_height - FallenFlakeTracker.stickiness) return false

    var collided = false
    var nearby_flakes = fallen_flakes.nearbyFlakes(this.x)

    for (var i = 0; !collided && i < nearby_flakes.length; i++) {
      var flake = nearby_flakes[i]
      if (flake !== this) {
        var dx = this.x - flake.x,
            dy = this.y - flake.y,
            radii = FallenFlakeTracker.stickiness

        if ((dx * dx) + (dy * dy) < (radii * radii)) collided = true
      }
    }

    return collided
  }

  SnowFlake.stickiness = 2

  SnowFlake.prototype.flakeIsFallen = function() {
    this.is_fallen = true
    fallen_flakes.addFlake(this)
    flakes.splice(flakes.indexOf(this), 1)
  }

  function Wind(direction) {
    this.direction = direction
    this.gust_burst = 0
  }

  Wind.prototype.step = function() {
    if (Math.abs(this.gust_burst - this.direction) > 2) {
      this.direction = this.direction + this.gust_burst
    }
    if (Math.random() < 0.05) {
      this.gust_burst = (Math.random() - 0.5) * 10
    }
  }

  function FallenFlakeTracker() {
    this.fallen_flakes = {}
    this.length = 0
    this.min_height = canvas.height
  }

  FallenFlakeTracker.prototype.prune = function(flake) {
    var key = Math.floor(flake.x),
        index = this.fallen_flakes[key].indexOf(flake)

    this.fallen_flakes[key].splice(index, 1)
    this.length--
  }
  
  FallenFlakeTracker.prototype.addFlake = function(flake) {
    this.length++
    var index = Math.floor(flake.x)
    if (!this.fallen_flakes[index]) this.fallen_flakes[index] = []
    this.fallen_flakes[index].push(flake)
    if (flake.y < this.min_height) this.setMinHeight(flake.y)
  }

  FallenFlakeTracker.prototype.setMinHeight = function(new_min) {
    this.min_height = new_min
    this.pruneHiddenFlakes()
  }

  FallenFlakeTracker.prototype.pruneHiddenFlakes = function() {
    for (var key in this.fallen_flakes) {
      var nearby_flakes = this.get(key)
      for (var i = 0; i < nearby_flakes.length; i++) {
        var flake = nearby_flakes[i]
        if (this.isFlakeHidden(flake)) this.prune(flake)
      }
    }
  }

  FallenFlakeTracker.prototype.isFlakeHidden = function(flake) {
    return (flake.y - flake.radius()) > this.min_height
  }

  FallenFlakeTracker.prototype.nearbyFlakes = function(x) {
    var flakes = []
    for (var key in this.fallen_flakes) {
      var nearby_flakes = this.get(key) || []
      for (var j = 0; j < nearby_flakes.length; j++) {
        flakes.push(nearby_flakes[j])
      }
    }

    return flakes
  }

  FallenFlakeTracker.prototype.get = function(i) {
    return this.fallen_flakes[i]
  }

  FallenFlakeTracker.prototype.getAll = function() {
    var flakes = []
    for (var key in this.fallen_flakes) {
      var local_flakes = this.get(key)
      for (var i = 0; i < local_flakes.length; i++) {
        flakes.push(local_flakes[i])
      }
    }
    
    return flakes
  }

  function LocalDebugger() {
    this.def_list = document.createElement('dl')
    this.flake_length_node = document.createElement('dd')
    this.flake_length_node.appendChild(document.createTextNode(''))
    this.fallen_flake_length_node = document.createElement('dd')
    this.fallen_flake_length_node.appendChild(document.createTextNode(''))

    var dt2 = document.createElement('dt')
    dt2.innerHTML = 'Fallen Flake size'
    this.def_list.appendChild(this.fallen_flake_length_node)
    this.def_list.appendChild(dt2)

    var dt1 = document.createElement('dt')
    dt1.appendChild(document.createTextNode('Flake size'))
    this.def_list.appendChild(this.flake_length_node)
    this.def_list.appendChild(dt1)

    document.body.appendChild(this.def_list)
  }

  LocalDebugger.prototype.updateStats = function() {
    this.updateFlakeLength()
    this.updateFallenFlakeLength()
  }

  LocalDebugger.prototype.updateFlakeLength = function() {
    this.flake_length_node.innerHTML = flakes.length
  }

  LocalDebugger.prototype.updateFallenFlakeLength = function() {
    this.fallen_flake_length_node.innerHTML = fallen_flakes.length
  }

  Array.max = function(array) {
    return Math.max.apply(Math, array)
  }

  Array.min = function(array) {
    return Math.min.apply(Math, array)
  }

  Math.rnd_snd = function() {
    return (Math.random())+(Math.random())+(Math.random());
  }

  function requestAnimationFrame() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function (callback) {
        setTimeout(callback, 1)
      }
  }

  animateScreen()
})()

