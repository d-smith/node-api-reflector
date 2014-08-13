var uuid = require('node-uuid');

module.exports = new function() {
  this.getAccessToken = function(username, password) {
    if(username === "notauser") {
      return {"status": 401, "response": {"error":"Invalid username or password"}}
    } else {
      return {"status": 200, "response":{ "access_token" : uuid.v1() }}
    }
  }
}
