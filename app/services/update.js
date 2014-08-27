var locker = require('./locking');

(function() {
  module.exports = new function() {

    this.itemNotLocked = "Item must be locked before updating it.";
    this.requiredAttributesMissing = "Body must include action and note attributes";

    var hasRequiredAttributes = function(item) {
      console.log('checking ' + item.action);
      if(item['action'] == undefined || item['note'] == undefined) {
        return false;
      } else {
        return true;
      }
    }

    this.update = function(token, item) {
        if(!locker.isLockedBy(token, item.workItemNo)) {
          throw this.itemNotLocked;
        } else {

          if(!hasRequiredAttributes(item)) {
            throw this.requiredAttributesMissing;
          }

          console.log('Unlocking ' + item.workItemNo);
          locker.unlock(token, item.workItemNo);
        }

    };
  };

})();
