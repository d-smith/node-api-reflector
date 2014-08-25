
var _ = require('underscore');

describe("The access token service can handle valid and invalid users", function(){
  var accessTokenSvc = require('../app/services/accessToken');

  it("returns an error when the username is notauser", function(done) {
    expect(_.has(accessTokenSvc.getAccessToken("notauser", ""), "error")).toBe(true);
    done();
  });

  it("returns a token when the username is not notauser", function(done) {
    var accessResponse = accessTokenSvc.getAccessToken("joeuser", "");
    expect(_.has(accessResponse, "error")).toBe(false);
    expect(_.has(accessResponse, "access_token")).toBe(true);
    done();
  });
});
