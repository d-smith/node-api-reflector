var _ = require('underscore')
var qs = require('querystring');
var accessToken = require('../services/accessToken.js')


module.exports = function(accessTokenSvc) {
  return {
    createAccessToken: function(request, response) {
      var body = request.body;

      switch(body.grant_type) {
      case "password" :
          var atoken = accessToken.getAccessToken(body.username, body.password);
          if(_.has(atoken, "error")) response.status(401);
          response.send(atoken);
          break;
        case "refresh_token" :
          if(body.refresh_token == undefined) {
            response.status(401);
            response.send({'error': 'refresh_token missing in request body'});
          } else {
            var rtResponse = accessToken.processRefreshToken(body.refresh_token);
            if(_.has(rtResponse, "error")) response.status(401);
            response.send(rtResponse);
          }
          break;
        default:
          response.status(401);
          response.send({'error': 'Invalid grant_type in request body'});
      }


    },

    revokeAccessToken : function(request, response) {
      response.status(200).send("");
    }

  };
}
