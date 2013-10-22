window.Snow.Debugger = (function() {
  function Debugger() {
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

  (function(klass) {
    klass.prototype.updateStats = function() {
      this.updateFlakeLength()
      this.updateFallenFlakeLength()
    }

    klass.prototype.updateFlakeLength = function() {
      this.flake_length_node.innerHTML = flakes.length
    }

    klass.prototype.updateFallenFlakeLength = function() {
      this.fallen_flake_length_node.innerHTML = fallen_flakes.length
    }
  })

  return Debugger
})()

