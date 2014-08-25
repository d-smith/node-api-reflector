(function() {
	var search = require("./search");
	var cache = require("./cache");

	module.exports = new function() {
		this.noSuchItem = "No such item";
		this.otherUserHadLock = "Item locked by someone else";

		this.lock = function(token, workItemNo) {
			console.log('lock ' + workItemNo);
			var item = search.findItem(workItemNo);
			if(item == undefined) {
				throw this.noSuchItem;
			}

			var cachedItem = cache.read(workItemNo);
			if(cachedItem == undefined) {
				cache.store(workItemNo, token);
				return true;
			} else if(cachedItem != token) {
				throw this.otherUserHadLock;
			} else {
				return true;
			}
		};

		this.unlock = function(token, workItemNo) {
			var cachedItem = cache.read(workItemNo);
			if(cachedItem == undefined) {
				return true;
			} else if(cachedItem != token) {
				throw this.otherUserHadLock;
			} else {
				cache.remove(workItemNo);
				return true;
			}
		};
	};

})();