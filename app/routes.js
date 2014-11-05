var accessTokenHandlers = require('./handlers/accessTokenHandlers');
var notificationSettingsHandler = require('./handlers/notificationSettingsHandler');
var searchHandler = require('./handlers/searchHandler');
var lockHandler = require('./handlers/lockHandler');
var updateHandler = require('./handlers/updateHandler');
var documentHandler = require('./handlers/documentHandler');
var rootHandler = require('./handlers/rootHandler');


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

  var root = rootHandler();



  app.get('/', root.rootPage);
  app.post('/xtrac-api/v1/oauth2/token', serviceAccessTokenHandlers.createAccessToken);
  app.post('/xtrac-api/v1/oauth2/revoke', serviceAccessTokenHandlers.revokeAccessToken);
  app.post('/xtrac-api/v1/notifications', serviceNotificationSettingsHandler.storeNotificationSettings);
  app.put('/xtrac-api/v1/notifications', serviceNotificationSettingsHandler.updateNotificationSettings);
  app.get('/xtrac-api/v1/tasks', serviceSearchHandler.findTasks);
  app.get('/xtrac-api/v1/tasks/:workItemNo', serviceSearchHandler.findItem);
  app.put('/xtrac-api/v1/tasks/:workItemNo/lock', serviceLockHandler.lock);
  app.delete('/xtrac-api/v1/tasks/:workItemNo/lock', serviceLockHandler.unlock);
  app.put('/xtrac-api/v1/tasks/:workItemNo', serviceUpdateHandler.update);
  app.get('/xtrac-api/v1/tasks/:id/documents/:docid', documentHandler.getDocument);
}
