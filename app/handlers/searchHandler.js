module.exports = function(searchSvc) {
  return {
    findTasks: function(request, response) {
      console.log("findTasks called with query " + request.query);
      console.log(request.query.filterCriteria);
      response.send(searchSvc.findTasks("foo"));
    }
  };
}
