var db = require('./dbAccess');

var dbHelper = {
	//for SignUp
	getUserData: function(username, callback) {
		db.getUserData(username, function(params) {
			callback(params);
		});
	},
	signUp: function(user, callback) {
		db.signUp(user, function(params) {
			callback(params);
		});
	},
	insertExpense: function(expense, callback) {
		db.insertExpense(expense, function(params) {
			callback(params);
		})
	},
	myExpenseList: function(user, callback) {
		db.getExpensesByUserName(user, function(params) {
			callback(params);
		})
	},
	totalExpense: function(expenseId, callback) {
		db.totalExpense(expenseId, function(params) {
			callback(params);
		});
	},
	addNewExpense: function(expense, callback) {
		db.addNewExpense(expense, function(params) {
			callback(params);
		});
	},
	addNewUserToExpense: function(data, callback) {
		db.addNewUserToExpense(data, function(params) {
			callback(params);
		});
	}
};

module.exports = dbHelper;