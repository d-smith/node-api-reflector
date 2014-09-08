var assert = require('assert');

module.exports = function(cacheSvc) {
  assert.notEqual(cacheSvc, undefined)
  return {
    storeNotificationSettings: function(request, response) {
      var deviceId = request.header('xtrac-device-id');
      if(deviceId == undefined) {
        response.status(400).send({'error':'Missing Xtrac-Device-Id header'});
        return;
      }

      var body = request.body;
      console.log('Lookup settings for ' + deviceId);
      var settings = cacheSvc.read(deviceId);
      if(settings == undefined) {
        console.log("cacheMiss")
        settings =  {allItems: true, highPriority: true, mediumPriority: true,
                      lowPriority: true, workAccess: false};
        cacheSvc.store(deviceId, settings);
      } else {
        console.log("cache hit");
      }

      response.send(settings);
    },

    updateNotificationSettings: function(request, response) {
      var deviceId = request.header('xtrac-device-id');
      if(deviceId == undefined) {
        response.status(400).send({'error':'Missing Xtrac-Device-Id header'});
        return;
      }

      var body = request.body;
      cacheSvc.store(deviceId, body.notificationSettings);
      response.send("");
    }
  };
}
