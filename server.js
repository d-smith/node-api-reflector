var express = require('express');
var uuid = require('node-uuid');
var qs = require('querystring');

var app = express.createServer(express.logger());

app.post('/v1/xtrac/oauth2/token', function(request, response) {

    var data = '';
    request.on('data', function(chunk) {
      data += chunk;
    });

    request.on('end', function() {
      var post = qs.parse(data);
      console.log(post);

      if(post.username === "notauser") {
        response.status(401).send({"error":"invalid username or password"})
      } else {
          response.send({ "access_token" : uuid.v1() });
      }
    });

});

var port = process.env.PORT || 8666;
app.listen(port, function() {
  console.log("Listening on " + port);
});
