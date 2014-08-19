var _ = require('underscore')
var qs = require('querystring');
var accessToken = require('../services/accessToken.js')


module.exports = function(accessTokenSvc) {
  return {
    createAccessToken: function(request, response) {
      var body = request.body;

      var atoken = accessToken.getAccessToken(body.username, body.password);
      if(_.has(atoken, "error")) response.status(401)
      response.send(atoken)
    },

    revokeAccessToken : function(request, response) {
      response.status(200).send("");
    }

  };
}
