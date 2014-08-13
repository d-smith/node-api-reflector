var _ = require('underscore')
var qs = require('querystring');
var accessToken = require('../services/accessToken.js')

module.exports = new function() {
  this.createAccessToken = function(request, response) {
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
  };

  this.revokeAccessToken = function(request,response) {
    response.status(200).send("");
  };
};
