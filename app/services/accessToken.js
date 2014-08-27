var uuid = require('node-uuid');

module.exports = new function() {
  this.getAccessToken = function(username, password) {
    console.log("getAccessToken called for " + username);
    if(username === "notauser") {
      return {"error":"Invalid username or password"}
    } else {
      return { "access_token" : uuid.v1() }
    }
  };

  //Parse out the token part of a bearer token auth header, e.g.
  //Authorization: Bearer x192379878734274873847
  this.getToken = function(authHeader) {
    if(authHeader == undefined) {
      return authHeader;
    }

    var authparts = authHeader.split(" ");
    if(authparts.length == 2)  {
      return authparts[1];
    } else {
      return undefined;
    }
  };
}
