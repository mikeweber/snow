(function() {
  Array.max = function(array) {
    return Math.max.apply(Math, array)
  }

  Array.min = function(array) {
    return Math.min.apply(Math, array)
  }

  // returns a gaussian distribution of random numbers centered around 0 with a standard deviation of 1
  // http://www.protonfish.com/random.shtml
  Math.rnd_snd = function() {
    return ((Math.random() * 2 - 1) + (Math.random() * 2 - 1) +(Math.random() * 2 - 1))
  }

  // returns the gaussian distribution centered around the 'mean' by 'stdev' standard deviations
  Math.rnd(mean, stdev) {
    if (!mean)  mean  = 0
    if (!stdev) stdev = 1
    return Math.rnd_snd() * stdev + mean
  }
})()

