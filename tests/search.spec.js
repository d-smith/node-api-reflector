describe('A search finds items that match work items', function()  {
	var search = require("../app/services/search");

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
