var uuid = require('node-uuid');

module.exports = new function() {
  this.getAccessToken = function(username, password) {
    console.log("getAccessToken called for " + username);
    if(username === "notauser") {
      return {"error":"Invalid username or password"};
    } else {

      var at = uuid.v1();
      var rt = uuid.v1();
      while(at === rt) {
        rt = uuid.v1();
      }

      return {
        "access_token" : at,
        "token_type" : "Bearer",
        "refresh_token" : rt,
        "expires_in" : 3600
      };
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
