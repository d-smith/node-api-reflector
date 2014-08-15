var accessTokenHandlers = require('./handlers/accessTokenHandlers');
var notificationSettingsHandler = require('./handlers/notificationSettingsHandler');


module.exports = function(app, services) {

  var serviceAccessTokenHandlers = accessTokenHandlers(
    services["accessTokenService"]
  );

  var serviceNotificationSettingsHandler = notificationSettingsHandler(
    services["cacheSvc"]
  );
  
  app.post('/v1/xtrac/oauth2/token', serviceAccessTokenHandlers.createAccessToken);
  app.post('/v1/xtrac/oauth2/revoke', serviceAccessTokenHandlers.revokeAccessToken);
  app.post('/v1/xtrac/notifications', serviceNotificationSettingsHandler.storeNotificationSettings);
}
