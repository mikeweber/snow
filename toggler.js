window.Snow.Toggler = (function() {
  function Toggler(renderer) {
    this.running = true
    // this.renderButton()
    this.setButtonText(this.button)
    this.startObservers()
    this.renderer = renderer
  }

  (function(klass) {
    klass.prototype.toggle = function(button) {
      this.running = !this.running
      this.setButtonText(button)
      if (this.running) this.renderer.animateScreen()
    }

    klass.prototype.setButtonText = function(button) {
      if (this.button) button.innerHTML = (this.running ? 'Stop' : 'Start')
    }

    klass.prototype.startObservers = function() {
      document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code == 'Escape') {
          this.toggle(this.button)
        }
        if (e.code === 'ArrowRight') {
          if (e.shiftKey) {
            this.renderer.camera.moveRight(1)
          } else {
            this.renderer.camera.rotateCamera(1)
          }
        }
        if (e.code === 'ArrowLeft') {
          if (e.shiftKey) {
            this.renderer.camera.moveLeft(1)
          } else {
            this.renderer.camera.rotateCamera(-1)
          }
        }
        if (e.code === 'ArrowUp') {
          this.renderer.camera.zoom(-1)
        }
        if (e.code === 'ArrowDown') {
          this.renderer.camera.zoom(1)
        }
      }.bind(this))
    }

    klass.prototype.renderButton = function() {
      this.button = document.createElement('button')
      var self = this
      this.button.onclick = function() { self.toggle(self.button) }
      document.body.appendChild(this.button)
    }
  })(Toggler)

  return Toggler
})()

