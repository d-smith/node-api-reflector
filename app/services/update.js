var locker = require('./locking');

(function() {
  module.exports = new function() {

    this.itemNotLocked = "Item must be locked before updating it.";

    this.update = function(token, item) {
        if(!locker.isLockedBy(token, item.workItemNo)) {
          throw this.itemNotLocked;
        } else {
          console.log('Unlocking ' + item.workItemNo);
          locker.unlock(token, item.workItemNo);
        }

    };
  };

})();
