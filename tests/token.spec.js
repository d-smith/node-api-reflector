
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
    expect(_.has(accessResponse, "refresh_token")).toBe(true);
    expect(_.has(accessResponse, "expires_in")).toBe(true);
    done();
  });

});

describe("Refresh tokens can be used to get a new access token", function() {
    var accessTokenSvc = require('../app/services/accessToken');

    it("returns new token info when rt is not 'expired'", function(done) {
      var rtResponse = accessTokenSvc.processRefreshToken('xxx');
      expect(_.has(rtResponse, "error")).toBe(false);
      expect(_.has(rtResponse, "access_token")).toBe(true);
      expect(_.has(rtResponse, "refresh_token")).toBe(true);
      expect(_.has(rtResponse, "expires_in")).toBe(true);
      done();
    });

    it("returns an error when rt is 'expired'", function(done) {
      var rtResponse = accessTokenSvc.processRefreshToken('expired');
      expect(_.has(rtResponse, "error")).toBe(true);
      done();
    });
});
