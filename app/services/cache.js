module.exports = new function() {
  var store = {};

  this.store = function(key, value) {
    store[key] = value;
  };

  this.read = function(key) {
    return store[key];
  };

  this.remove = function(key) {
  	delete store[key];
  }
}
