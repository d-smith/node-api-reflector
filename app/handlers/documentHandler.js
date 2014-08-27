(function() {

  var fs = require('fs');
  var pdfDoc = fs.readFileSync("./docrepo/Hipster_Ipsum.pdf");
  var textDoc = fs.readFileSync("./docrepo/hipster.txt");

  module.exports = new function() {
    return {
      getDocument: function(request, response) {
        var workItemNo = request.param("id");
        var documentId = request.param("docid");
        console.log('get document ' + documentId + ' for item ' + workItemNo);
        if(documentId == 1) {
          response.send(pdfDoc);
        } else if(documentId == 2) {
          response.send(textDoc);
        } else {
          response.status(404).send({error:'Requested document for the given work item not found'});
        }
      }
    };
  };
})();
