
//Set up express and create app
var express = require('express');
var app = express.createServer(express.logger());

//load routes
require('./app/routes')(app);

//Start the server listener
var port = process.env.PORT || 8666;
app.listen(port, function() {
  console.log("Listening on " + port);
});
