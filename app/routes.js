var accessTokenHandlers = require('./handlers/accessTokenHandlers');
var notificationSettingsHandler = require('./handlers/notificationSettingsHandler');
var searchHandler = require('./handlers/searchHandler');


module.exports = function(app, services) {

  var serviceAccessTokenHandlers = accessTokenHandlers(
    services["accessTokenService"]
  );

  var serviceNotificationSettingsHandler = notificationSettingsHandler(
    services["cacheSvc"]
  );

  var serviceSearchHandler = searchHandler(
    services["searchSvc"]
  );


  app.post('/v1/xtrac/oauth2/token', serviceAccessTokenHandlers.createAccessToken);
  app.post('/v1/xtrac/oauth2/revoke', serviceAccessTokenHandlers.revokeAccessToken);
  app.post('/v1/xtrac/notifications', serviceNotificationSettingsHandler.storeNotificationSettings);
  app.put('/v1/xtrac/notifications', serviceNotificationSettingsHandler.updateNotificationSettings);
  app.get('/v1/xtrac/tasks', serviceSearchHandler.findTasks);
}
