var accessTokenService = require('./services/accessToken');
var accessTokenHandlers = require('./handlers/accessTokenHandlers');


module.exports = function(app, services) {
  var serviceAccessTokenHandlers = accessTokenHandlers(services["accessTokenService"]);
  app.post('/v1/xtrac/oauth2/token', serviceAccessTokenHandlers.createAccessToken);
  app.post('/v1/xtrac/oauth2/revoke', serviceAccessTokenHandlers.revokeAccessToken);
}
