window.Snow.Toggler = (function() {
  function Toggler(renderer) {
    this.running = true
    this.renderButton()
    this.setButtonText(this.button)
    this.renderer = renderer
  }

  (function(klass) {
    klass.prototype.toggle = function(button) {
      this.running = !this.running
      this.setButtonText(button)
      if (this.running) this.renderer.animateScreen()
    }

    klass.prototype.setButtonText = function(button) {
      button.innerHTML = (this.running ? 'Stop' : 'Start')
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

