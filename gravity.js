window.Snow.Gravity = (function() {
  var klass = function Gravity() {
  }

  klass.prototype.applyForce = function(entity) {
    return { x: 0, y: entity.mass * -9.8 }
  }

  return klass
})()
