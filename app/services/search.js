(function() {
  var _ = require('underscore');

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

    var makeMemoField = function(memo) {
      var field = {};
      field.field = "Memo";
      field.value = memo;
      return field;
    }

    var addMoreFakeFields = function(fields) {
      fields.push({"field":"queue", "value":"HIREQ"});
      fields.push({"field":"status", "value":"APPROVE"});
      fields.push({"field":"Priority", "value":"high"});
    }

    var mapToReturnItem = function(theObj) {
        var item = {};
        item.workItemNo = theObj.workItemNo;
        item.accessType = theObj.accessType;
        item.jeopardy = [{"field":"QCTD", "value":"2014-07-23T10:05:34.010Z", "status":"RED"}];
        item.fields = [];
        item.fields.push(makeMemoField(theObj.memo));
        addMoreFakeFields(item.fields);
        return item;
    };

  module.exports = new function() {

    this.findItem = function(workItemNo) {
      console.log('retrieving item ' + workItemNo);
      var item = _.filter(sampleItems, function(theObj) {
        return theObj.workItemNo == workItemNo;
      });

      if(item.length == 0) {
        return null;
      } else {
        return mapToReturnItem(item[0]);
      }
    };


    this.findTasks = function(memo, accessType) {
      console.log('findTasks called with args ' + memo + ' and ' + accessType);
      var access;
      if(accessType === 'work') {
        access = 'work';
      } else {
        access = 'view';
      }

      if(memo == undefined) {
        return [];
      }
      return _.map(
        _.filter(sampleItems, function(theObj) {
          theObj.accessType = access;
          return theObj.memo == memo;
        }),
        mapToReturnItem
      );

    }
  };
})();
