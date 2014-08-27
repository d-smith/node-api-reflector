

describe("Mobile tasks", function() {
  var update = require('../app/services/update');
  var locker = require('../app/services/locking');


  it("cannot be updated if not locked", function(done) {
    var item = { workItemNo: 'W000001-08AUG14' };
    expect(function() {
        update.update('xxx', item);
    }).toThrow(update.itemNotLocked)
    done();
  });

  it("must include action and note attributes", function(done) {
    var item = { workItemNo: 'W000003-08AUG14' };
    var getItemNo = function() { return item.workItemNo; };

    expect(function() {
      locker.lock('xxx', getItemNo());
      update.update('xxx', item);
    }).toThrow(update.requiredAttributesMissing);
    done();
  });


  it("is unlocked after being updated", function(done) {
    var item = {
      workItemNo: 'W000003-08AUG14',
      action: "approved",
      note: "looks ok I guess"
    };
    var getItemNo = function() { return item.workItemNo; };
    locker.lock('xxx', getItemNo());
    expect(locker.isLockedBy('xxx', getItemNo())).toBe(true);
    update.update('xxx', item);
    expect(locker.isLockedBy('xxx', getItemNo())).toBe(false);
    done();
  });

});
