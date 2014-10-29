if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}


var gobbleRemainingValueTokens = function(startingVal, tokens, startWith) {
  if(startingVal.endsWith("'")) {
    return startingVal.slice(1,-1);
  }

  var value = startingVal;
  for(var idx = startWith; idx < tokens.length; idx++) {
    var token = tokens[idx];
    value += " ";
    value += tokens[idx];
    if(token.endsWith("'")) {
      value = value.slice(1,-1);
      break;
    }
  }
  return value;
}

var parseOutField = function(filterCriteria, targetField) {
  for(idx in filterCriteria) {
    var criteria = filterCriteria[idx];
    var tokens = criteria.split(" ");
    var fieldName = (tokens[0].split(":"))[1];
    if(fieldName == targetField) {
      var value = (tokens[2].split(":"))[1];
      if(value.startsWith("'")) {
        value = gobbleRemainingValueTokens(value, tokens, 3);
      }
      return value;
    }
  }

  return null;
};


var memoParser = function(filterCriteria) {
  return parseOutField(filterCriteria, "Memo");
}

var workAccessParser = function(filterCriteria) {
    return parseOutField(filterCriteria, "Memo");
};



module.exports = function(searchSvc) {
  return {
    findTasks: function(request, response) {
      console.log("findTasks called with query " + request.query);
      var filterCriteria = request.query.filterCriteria;
      var memoSearchVal = memoParser(filterCriteria);
      var workAccess = request.query.workAccess;
      if(typeof workAccess === 'undefined') {
        workAccess = "all";
      }

      response.send(searchSvc.findTasks(memoSearchVal, workAccess));
    },
    findItem: function(request, response) {
      var workItemNo = request.param("workItemNo");
      var workItem = searchSvc.findItem(workItemNo);
      if(workItem == null) {
        response.status(404);
        response.send({error: 'item not found'});
      } else {
        response.send(workItem);
      }
    }
  };
}
