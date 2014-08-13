var uuid = require('node-uuid');

module.exports = new function() {
  this.getAccessToken = function(username, password) {
    if(username === "notauser") {
      return {"error":"Invalid username or password"}
    } else {
      return { "access_token" : uuid.v1() }
    }
  }
}
