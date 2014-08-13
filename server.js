var express = require('express');
var qs = require('querystring');
var accessToken = require('./accessToken.js')
var _ = require('underscore')
var app = express.createServer(express.logger());

app.post('/v1/xtrac/oauth2/token', function(request, response) {

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

});

var port = process.env.PORT || 8666;
app.listen(port, function() {
  console.log("Listening on " + port);
});
