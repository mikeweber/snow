window.Snow.Wind = (function() {
  var klass = function Wind(position, speed, window_width) {
    this.position = position
    this.speed = speed
    this.window_width = window_width
    this.width = 600
    this.edge_width = 200
  }

  klass.prototype.step = function(dt) {
    this.position += dt * this.speed * 100
    if (this.getLeftEdge() > this.window_width) this.position = -(this.width + this.edge_width)
  }

  klass.prototype.getSpeed = function(x, z) {
    var left = this.getLeft()
    var right = this.getRight()
    if (left < x && x < right) {
      return this.speed * z
    } else {
      return 0
    }

    return this.speed * z
  }

  klass.prototype.getLeftEdge = function() {
    return this.getLeft() - this.edge_width
  }

  klass.prototype.getRightEdge = function() {
    return this.getRight() + this.edge_width
  }

  klass.prototype.getLeft = function() {
    return this.position - this.width
  }

  klass.prototype.getRight = function() {
    return this.position + this.width
  }

  return klass
})()

