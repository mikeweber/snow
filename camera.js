window.Snow.Camera = (function() {
  var klass = function Camera(pos, target) {
    this.up         = math.matrix([0, 1, 0])
    this.eye        = math.matrix(pos)
    this.target     = math.matrix(target)
    this.model      = this.buildModelMatrix()
    this.view       = this.lookAtTarget()
    this.near       = 1
    this.far        = 10
    this.projection = this.buildProjectionMatrix()
  }

  klass.prototype.project = function(pos3d) {
    return this.multiplyPointByMatrix(this.multiplyPointByMatrix(pos3d, this.getModelMatrix()), this.getProjectionMatrix())
  }

  klass.prototype.moveRight = function(magnitude) {
    if (!magnitude) magnitude = 1
    this.eye = this.eye.add([magnitude, 0, 0])
    this.view = this.lookAtTarget()
  }

  klass.prototype.getViewMatrix = function() {
    return this.view
  }

  klass.prototype.lookAtTarget = function(target) {
    if (!target) target = this.target

    var zaxis = this.normal(math.subtract(this.eye, target))
    var xaxis = this.normal(math.cross(this.up, zaxis))
    var yaxis = math.cross(zaxis, xaxis)

    return [
      xaxis.resize([4], -math.dot(xaxis, this.eye)).toArray(),
      yaxis.resize([4], -math.dot(yaxis, this.eye)).toArray(),
      zaxis.resize([4], -math.dot(zaxis, this.eye)).toArray(),
      [0, 0, 0, 1]
    ]
  }

  klass.prototype.getProjectionMatrix = function() {
    return this.projection
  }

  klass.prototype.buildProjectionMatrix = function() {
    var scale         = 1 / Math.tan(Math.PI / 4)
    var view_distance = this.far - this.near
    var far           = -this.far / view_distance
    var near          = -this.far * this.near / view_distance

    return [
      [scale,     0,     0,     0],
      [    0, scale,     0,     0],
      [    0,     0,   far,    -1],
      [    0,     0,  near,     0]
    ]
  }

  klass.prototype.getModelMatrix = function() {
    return this.model
  }

  klass.prototype.buildModelMatrix = function() {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0,-1, 0],
      [0, 0, 0, 1]
    ]
  }

  klass.prototype.multiplyPointByMatrix = function(point, matrix) {
    var w = (point.x * matrix[0][3] + point.y * matrix[1][3] + point.z * matrix[2][3] + matrix[3][3])
    var x = (point.x * matrix[0][0] + point.y * matrix[1][0] + point.z * matrix[2][0] + matrix[3][0]) / w
    var y = (point.x * matrix[0][1] + point.y * matrix[1][1] + point.z * matrix[2][1] + matrix[3][1]) / w
    var z = (point.x * matrix[0][2] + point.y * matrix[1][2] + point.z * matrix[2][2] + matrix[3][2])

    return { x: x, y: y, z: z }
  }

  klass.prototype.normal = function(vector) {
    return math.divide(vector, this.magnitude(vector))
  }

  klass.prototype.magnitude = function(vector) {
    var sum = 0
    vector.forEach(function(el) {
      sum += el * el
    }, true)
    return Math.sqrt(sum)
  }

  return klass
})()
