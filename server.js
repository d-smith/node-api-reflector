
//Set up express and create app
var express = require('express');
var app = express.createServer(express.logger());
app.use(express.bodyParser());

var services = {};
services["accessTokenService"] = require('./app/services/accessToken');
services["cacheSvc"] = require('./app/services/cache');
services["searchSvc"] = require('./app/services/search');
services["lockSvc"] = require('./app/services/locking.js');
services["updateSvc"] = require('./app/services/update.js');

//load routes
require('./app/routes')(app,services);

//Start the server listener
var port = process.env.PORT || 8666;
app.listen(port, function() {
  console.log("Listening on " + port);
});
