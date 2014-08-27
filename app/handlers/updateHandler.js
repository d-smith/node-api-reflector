(function(){

  var getToken = require('../services/accessToken').getToken;

  module.exports = function(updateSvc) {
    return {
      update: function(request, response) {
          var authHeader = request.header('authorization');

          var token = getToken(authHeader);
          var item = request.body;
          item.workItemNo = request.param("workItemNo");

          if(token == undefined) {
            response.status(401);
            response.send({'error': 'Authorization bearer token must accompany request'});
          } else {
            try {
              updateSvc.update(token, item);
              response.send("");
            } catch(err) {
              if(err == updateSvc.itemNotLocked) {
                response.status(412).send({error: 'Item not locked or does not exist.'});
              } else if(err == updateSvc.requiredAttributesMissing) {
                response.status(412).send({error: 'Request body is missing required attributes'});
              } else {
                response.status(500).send({error: 'Unexpected server error occurred'});
              }
            }
          }
      }
    };
  };
})();
