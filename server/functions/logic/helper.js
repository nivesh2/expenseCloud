var helper = {

	/*
	 * Get the expenses for a particular month
	 */
	filterResultByMonth: function(p, month, callback) {
		//synchronous 
		p.record.sort(compareRecords);
		p.record.filter(filterByMonth);
		callback(p);


		function filterByMonth(obj) {
			console.log('1', obj.addedby);
			var date = new Date(obj.date);
			return true;
			// Month starts with 0 in javascript
			if ((date.getMonth() + 1) === month) {
				return true;
			} else {
				return false;
			}
		};
	}
};


/*
 * Compare function for date comparision
 */
function compareRecords(a, b) {
	if (a.date < b.date) {
		return 1;
	} else if (a.date > b.date) {
		return -1;
	}
	return 1;
};

module.exports = helper;