describe("A cache can store and retrieve values by key", function() {
  var cache = require("../app/services/cache");

  it("can store and retrieve a value by key", function(done) {
    var value = {foo: "foo", bar: "bar"};
    cache.store("key", value);
    var cachedVal = cache.read("key");
    expect(cachedVal.foo).toBe("foo");
    expect(cachedVal.bar).toBe("bar");
    done();
  });

  it("can update an item", function(done){
    cache.store("key", {baz:"baz"});
    var cachedVal = cache.read("key");
    expect(cachedVal.baz).toBe("baz");
    done();
  });

  it("returns null on a cache miss", function(done){
    expect(cache.read("no such key")).toBe(undefined);
    done();
  });

  it("allows values to be removed from the cache", function(done) {
    expect(cache.read("key").baz).toBe("baz");
    cache.remove("key");
    expect(cache.read("key")).toBe(undefined);
    done();
  });
});
