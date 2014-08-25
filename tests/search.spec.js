var search = require("../app/services/search");

describe('A search finds items that match work items', function()  {
	

	it('Matches items by memo', function(done) {
		var items = search.findTasks('Ready for approval');
		expect(items.length).toBe(3);
		expect(items[0].workItemNo).toBe('W000001-08AUG14');
		done();
	});

	it('Returns an empty array if there is no match', function(done) {
		var items = search.findTasks('XXXXX No Match XXXXX');
		expect(items.length).toBe(0);
		done();
	});
});


describe('Items can be retrieved directly', function(done) {
	it('Returns an item if one for the item no exists', function(done) {
		var item = search.findItem('W000005-08AUG14');
		expect(item.workItemNo).toBe('W000005-08AUG14');
		done();
	});

	it('Returns null if no march is found', function(done) {
		var item = search.findItem('W000123-01APR95');
		expect(item).toBe(null);
		done();
	});
});
