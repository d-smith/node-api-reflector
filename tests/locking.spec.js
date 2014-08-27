
jasmine.getEnv().addReporter(new jasmine.ConsoleReporter(console.log));
describe('A work item locker', function() {
	var locking = require("../app/services/locking");

	it('locks unlocked items', function(done) {
		expect(locking.lock('xxx', 'W000001-08AUG14')).toBe(true);
		done();
	});

	it('ignores requests to lock the item again for the same user', function(done) {
		expect(locking.lock('xxx', 'W000001-08AUG14')).toBe(true);
		done();
	});

	it('throws an exception if someone else has the lock', function(done) {
		expect(function() {
			locking.lock('yyy', 'W000001-08AUG14');
		}).toThrow(locking.otherUserHadLock);

		done();
	});

	it('throws an exception when locking an item that does not exist', function(done) {
		expect(function() {
			locking.lock('xxx', 'W000001-08AUG08');
		}).toThrow(locking.noSuchItem);

		done();
	});

	it("doesn't complain when unlocked undefined items", function(done) {
		expect(locking.unlock('xxx', 'W123456-01JAN01')).toBe(true);
		done();
	});

	it('throws an exception is someone else has the lock', function(done) {
		expect(function() {
			locking.unlock('zzz', 'W000001-08AUG14');
		}).toThrow(locking.otherUserHadLock);
		done();
	});

	it('unlocks a locked item', function(done){
		expect(locking.unlock('xxx', 'W000001-08AUG14')).toBe(true);
		expect(locking.lock('aaa', 'W000001-08AUG14')).toBe(true);
		locking.unlock('aaa', 'W000001-08AUG14')
		done();
	});

	it('returns true when asked by the lock owner if it has the lock, false otherwise', function(done) {
		expect(locking.lock('aaa', 'W000001-08AUG14')).toBe(true);
		expect(locking.isLockedBy('aaa', 'W000001-08AUG14')).toBe(true);
		expect(locking.isLockedBy('bbb', 'W000001-08AUG14')).toBe(false);
		expect(locking.isLockedBy('bbb', 'W110001-08AUG13')).toBe(false);
		done();
	});

});
