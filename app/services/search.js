var _ = require('underscore');

module.exports = new function() {
  var sampleItems = [
  {"workItemNo":"W000001-08AUG14", "memo":"Ready for approval"},
  {"workItemNo":"W000002-08AUG14", "memo":"Ready for approval"},
  {"workItemNo":"W000003-08AUG14", "memo":"Not ready for approval"},
  {"workItemNo":"W000004-08AUG14", "memo":"Ready for approval I guess"},
  {"workItemNo":"W000005-08AUG14", "memo":"Ready for approval now"},
  {"workItemNo":"W000006-08AUG14", "memo":"Could you approve this already"},
  {"workItemNo":"W000007-08AUG14", "memo":"Ready for rejection"},
  {"workItemNo":"W000008-08AUG14", "memo":"Reject-a-mundo"},
  {"workItemNo":"W000009-08AUG14", "memo":"Approve?"},
  {"workItemNo":"W000010-08AUG14", "memo":"Ready for approval"}
  ];


  this.findTasks = function(memo) {
    console.log('findTasks called with arg ' + memo);
    if(memo == undefined) {
      return [];
    }
    return _.filter(sampleItems, function(theObj) { return theObj.memo == memo; });
  }
};
