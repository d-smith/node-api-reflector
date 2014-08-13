var accessTokenService = require('./services/accessToken');
var accessTokenHandlers = require('./handlers/accessTokenHandlers');
var serviceAccessTokenHandlers = accessTokenHandlers(accessTokenService);

module.exports = function(app) {
  app.post('/v1/xtrac/oauth2/token', serviceAccessTokenHandlers.createAccessToken);
  app.post('/v1/xtrac/oauth2/revoke', serviceAccessTokenHandlers.revokeAccessToken); 
}
