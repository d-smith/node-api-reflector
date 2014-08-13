var _ = require('underscore')
var qs = require('querystring');
var accessToken = require('../services/accessToken.js')


module.exports = function(accessTokenSvc) {
  return {
    createAccessToken: function(request, response) {
      var data = '';
      request.on('data', function(chunk) {
        data += chunk;
      });

      request.on('end', function() {
        var post = qs.parse(data);
        console.log(post);
        var atoken = accessToken.getAccessToken(post.username, post.password);
        if(_.has(atoken, "error")) response.status(401)
        response.send(atoken)
      });
    },

    revokeAccessToken : function(request, response) {
      response.status(200).send("");
    }

  };
}
