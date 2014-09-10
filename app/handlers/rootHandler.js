(function() {

    var page = "<html><body><p>You have reached the <a href=\"http://docs.xtracmobileappapi.apiary.io/\">XTRAC Mobile API</a> reflector</body></html>";

    module.exports = function() {
      return {
          rootPage: function(request, response) {
            response.status(200);
            response.send(page);
          }
      };
    }
})();
