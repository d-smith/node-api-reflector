var accessTokenHandlers = require('./handlers/accessTokenHandlers');
var notificationSettingsHandler = require('./handlers/notificationSettingsHandler');
var searchHandler = require('./handlers/searchHandler');
var lockHandler = require('./handlers/lockHandler');
var updateHandler = require('./handlers/updateHandler');
var documentHandler = require('./handlers/documentHandler');


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

  var serviceLockHandler = lockHandler(
    services["lockSvc"]
  );

  var serviceUpdateHandler = updateHandler(
    services["updateSvc"]
  );




  app.post('/v1/xtrac/oauth2/token', serviceAccessTokenHandlers.createAccessToken);
  app.post('/v1/xtrac/oauth2/revoke', serviceAccessTokenHandlers.revokeAccessToken);
  app.post('/v1/xtrac/notifications', serviceNotificationSettingsHandler.storeNotificationSettings);
  app.put('/v1/xtrac/notifications', serviceNotificationSettingsHandler.updateNotificationSettings);
  app.get('/v1/xtrac/tasks', serviceSearchHandler.findTasks);
  app.get('/v1/xtrac/tasks/:workItemNo', serviceSearchHandler.findItem);
  app.put('/v1/xtrac/tasks/:workItemNo/lock', serviceLockHandler.lock);
  app.delete('/v1/xtrac/tasks/:workItemNo/lock', serviceLockHandler.unlock);
  app.put('/v1/xtrac/tasks/:workItemNo', serviceUpdateHandler.update);
  app.get('/v1/xtrac/tasks/:id/documents/:docid', documentHandler.getDocument);
}
