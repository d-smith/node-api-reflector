var uuid = require('node-uuid');

module.exports = new function() {
  this.getAccessToken = function(username, password) {
    console.log("getAccessToken called for " + username);
    if(username === "notauser") {
      return {"error":"Invalid username or password"}
    } else {
      return { "access_token" : uuid.v1() }
    }
  }
}
