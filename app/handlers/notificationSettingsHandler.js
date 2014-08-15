var assert = require('assert');

module.exports = function(cacheSvc) {
  assert.notEqual(cacheSvc, undefined)
  return {
    storeNotificationSettings: function(request, response) {
      var body = request.body;
      console.log('Lookup settings for ' + body.uuid);
      var settings = cacheSvc.read(body.uuid);
      if(settings == undefined) {
        console.log("cacheMiss")
        settings =  {allItems: true, highPriority: false, workAccess: false};
        cacheSvc.store(body.uuid, settings);
      } else {
        console.log("cache hit");
      }

      response.send(settings);
    },

    updateNotificationSettings: function(request, response) {
      var body = request.body;
      cacheSvc.store(body.uuid, body.notificationSettings);
      response.send("");
    }
  };
}
