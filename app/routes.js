var accessTokenHandlers = require('./handlers/accessTokenHandlers')

module.exports = function(app) {
  app.post('/v1/xtrac/oauth2/token', accessTokenHandlers.createAccessToken);
  app.post('/v1/xtrac/oauth2/revoke', accessTokenHandlers.revokeAccessToken); 
}
