window.Snow.Camera = (function() {
  var klass = function Camera(screen, eye, target) {
    this.screen = screen
    this.up     = [0, 1, 0]
    this.eye    = eye
    this.target = target
    this.angle  = this.calculateCameraAngleToTarget(this.eye, this.target)
    this.near   = 1
    this.far    = 10
    this.rebuildMatrices()
  }

  klass.prototype.project = function(pos3d) {
    // var M   = this.getModelMatrix()
    // var V   = this.getViewMatrix()
    // var P   = this.getProjectionMatrix()
    // var MV  = math.multiply(M,  V)
    // var MVP = math.multiply(MV, P)

    // var PV  = math.multiply(P, V)
    // var PVM = math.multiply(PV, M)

    var V     = this.getViewMatrix()
    var P     = this.getProjectionMatrix()
    var M     = this.convertToModelMatrix(pos3d)
    var VP    = math.multiply(P, V)
    var MVP   = math.multiply(VP, M)
    var pos2d = this.multiplyPointByMatrix({ x: 0, y: 0, z: 0 }, MVP)
    if (this.isClipped(pos2d)) return false
    pos2d = this.convertClippedPositionToScreen(pos2d)
    pos2d.z = this.distanceFromCamera(pos3d)

    return pos2d
  }

  klass.prototype.calculateCameraAngleToTarget = function(camera, target) {
    var x = camera[0] - target[0]
    var z = camera[2] - target[2]

    return Math.atan2(z, x)
  }

  // return true when the position is outside of the projection frustrum
  klass.prototype.isClipped = function(pos2d) {
    return (Math.abs(pos2d.x) > 1 || Math.abs(pos2d.y) > 1 || Math.abs(pos2d.z) > 1)
  }

  // The clipped space converts all viewable points into a dimension between -1 and 1.
  // After unviewable clipped space points are removed, convert the dimensions
  // back into screen dimensions
  klass.prototype.convertClippedPositionToScreen = function(pos) {
    return {
      x: (pos.x + 1) * (this.screen.width / 2),
      y: (pos.y + 1) * (this.screen.height / 2),
      z: (pos.z + 1) * (this.screen.width) // arbitrarily using the width to convert Z coordinates to screen space
    }
  }

  klass.prototype.moveRight = function(magnitude) {
    if (!magnitude) magnitude = 10
    this.translateCamera([magnitude, 0, 0])
    //this.translateTarget([magnitude, 0, 0])
  }

  klass.prototype.moveLeft = function(magnitude) {
    if (!magnitude) magnitude = 10
    this.translateCamera([-magnitude, 0, 0])
    //this.translateTarget([-magnitude, 0, 0])
  }

  klass.prototype.rotateCamera = function(degrees) {
    if (!degrees) degrees = 1

    this.angle += degrees / 180 * Math.PI
    var distx = this.target[0] - this.eye[0]
    var distz = this.target[2] - this.eye[2]
    var dist = Math.sqrt(distx * distx + distz * distz)
    var x = Math.cos(this.angle) * dist
    var z = Math.sin(-this.angle) * dist
    this.moveCameraTo([x, this.eye[1], z])
  }

  klass.prototype.zoom = function(magnitude) {
    if (!magnitude) magnitude = 1
    var distx = this.target[0] - this.eye[0]
    var distz = this.target[2] - this.eye[2]
    var dist = Math.sqrt(distx * distx + distz * distz)
    dist += magnitude
    var x = Math.cos(this.angle) * dist
    var z = Math.sin(-this.angle) * dist
    this.moveCameraTo([x, this.eye[1], z])
  }

  klass.prototype.translateCamera = function(magnitude) {
    this.moveCameraTo(math.add(this.eye, magnitude))
  }

  klass.prototype.moveCameraTo = function(pos) {
    this.eye = pos
    console.log(this.angle * 180 / Math.PI)
    console.log(this.eye)
    this.rebuildMatrices()
  }

  klass.prototype.translateTarget = function(magnitude) {
    this.target = math.add(this.target, magnitude)
    this.rebuildMatrices()
  }

  klass.prototype.distanceFromCamera = function(pos) {
    var x = pos.x - this.eye[0]
    var y = pos.y - this.eye[1]
    var z = pos.z - this.eye[2]

    return Math.sqrt(x * x + y * y + z * z)
  }

  klass.prototype.vectorToPosition = function(vector) {
    return { x: vector[0], y: vector[1], z: vector[2] }
  }

  klass.prototype.positionToVector = function(pos) {
    return [pos.x, pos.y, pos.z]
  }

  klass.prototype.rebuildMatrices = function() {
    this.view       = this.lookAtTarget()
    this.model      = this.buildModelMatrix()
    this.projection = this.buildProjectionMatrix()
  }

  klass.prototype.getViewMatrix = function() {
    return this.view
  }

  klass.prototype.lookAtTarget = function(target) {
    if (!target) target = this.target

    var zaxis = this.normal(math.subtract(this.eye, target))
    var xaxis = this.normal(math.cross(this.up, zaxis))
    var yaxis = math.cross(zaxis, xaxis)

    xaxis.push(-math.dot(xaxis, this.eye))
    yaxis.push(-math.dot(yaxis, this.eye))
    zaxis.push(-math.dot(zaxis, this.eye))

    return [
      xaxis,
      yaxis,
      zaxis,
      [0, 0, 0, 1]
    ]
  }

  klass.prototype.convertToModelMatrix = function(pos) {
    return [
      [pos.x,     0,     0, 0],
      [    0, pos.y,     0, 0],
      [    0,     0, pos.z, 0],
      [    0,     0,     0, 1]
    ]
  }

  klass.prototype.getProjectionMatrix = function() {
    return this.projection
  }

  klass.prototype.buildProjectionMatrix = function() {
    var h             = this.screen.height
    var aspect_ratio  = this.screen.width / h
    var right         = this.near
    var top           = right / aspect_ratio
    var scale_x       = this.near / right
    var scale_y       = this.near / top
    var view_distance = this.far - this.near
    var far           = -(this.far + this.near) / view_distance
    var near          = (-2 * this.far * this.near) / view_distance

    return [
      [scale_x,       0,     0,     0],
      [      0, scale_y,     0,     0],
      [      0,       0,   far,    -1],
      [      0,       0,  near,     0]
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
    var x = (point.x * matrix[0][0] + point.y * matrix[1][0] + point.z * matrix[2][0] + matrix[3][0])
    var y = (point.x * matrix[0][1] + point.y * matrix[1][1] + point.z * matrix[2][1] + matrix[3][1])
    var z = (point.x * matrix[0][2] + point.y * matrix[1][2] + point.z * matrix[2][2] + matrix[3][2])
    var w = (point.x * matrix[0][3] + point.y * matrix[1][3] + point.z * matrix[2][3] + matrix[3][3])

    if (w != 0) {
      x /= w
      y /= w
      z /= w
    }
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
