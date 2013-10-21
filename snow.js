(function() {
  var canvas = document.getElementById('snow'),
      ctx    = canvas.getContext('2d'),
      flakes = [],
      fallen_flakes = []
  canvas.width = 1000
  canvas.height = 800

  function drawSnowFlakes(ctx, flakes) {
    for (var i = 0; i < flakes.length; i++) {
      drawSnowFlake(ctx, flakes[i])
    }
  }

  function drawSnowFlake(ctx, flake) {
    ctx.beginPath()
    ctx.arc(flake.x, flake.y, flake.z, 0, 2 * Math.PI, false)
    ctx.fillStyle = '#FFF'
    ctx.fill()
  }

  function updateSnowFlakes() {
    for (var i = 0; i < flakes.length; i++) {
      flakes[i].step()
    }

    if (Math.random() < 0.5) {
      addSnowFlake()
    }
  }

  function addSnowFlake() {
    flakes.push(new SnowFlake(Math.random() * canvas.width, 0, Math.random() * 5))
  }

  function animateScreen() {
    function step() {
      clearCanvas(ctx, canvas)
      drawSnowFlakes(ctx, flakes)
      updateSnowFlakes()

      requestAnimationFrame()(step)
    }
    requestAnimationFrame()(step)
  }

  function clearCanvas(ctx, canvas) {
    ctx.fillStyle = '#87ceeb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function SnowFlake(x, y, z) {
    this.x = x
    this.y = 0
    this.z = z
    this.float = 0
    this.is_fallen = false
  }

  SnowFlake.prototype.step = function() {
    if (this.is_fallen) return
    if (this.detectCollision() || this.y >= canvas.height) {
      this.is_fallen = true
      fallen_flakes.push(this)
      return
    }

    this.y += 1 * this.z
    this.float += 0.1
    this.x += Math.sin(this.float) * this.z * 0.2
  }

  SnowFlake.prototype.detectCollision = function() {
    var collided = false
    for (var i = 0; !collided && i < fallen_flakes.length; i++) {
      var flake = fallen_flakes[i]
      if (flake !== this) {
        var dx = this.x - flake.x,
            dy = this.y - flake.y,
            radii = this.z + flake.z

        if ((dx * dx) + (dy * dy) < (radii * radii)) collided = true
      }
    }

    return collided
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

