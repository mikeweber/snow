window.Snow.Wind = (function() {
  function Wind(direction) {
    this.direction = direction
    this.gust_burst = 0
  }

  Wind.prototype.step = function(dt) {
    if (Math.abs(this.gust_burst - this.direction) > 2) {
      this.direction = this.direction + this.gust_burst * 0.01 * dt
    }
    // There's a 0.05 chance of a change in wind
    if (Math.random() < 0.05) {
      // If there is a change in wind, the speed and direction should center around 0
      this.gust_burst = Math.rnd(0, 10)
    }
  }

  return Wind
})()

