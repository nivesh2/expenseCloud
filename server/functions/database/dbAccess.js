/* global callback */
var ObjectID = require('mongodb').ObjectID;
var config = require('config');
var dbConnect = require('./dbConnect');

var db = {
	/*
	 * returns the user object from user_expense collection(DB)
	 * depending on username (unique and is set manual index)
	 * thus this is used in login module.
	 */
	getUserData: function(username, callback) {
		console.log('DB Access');
		var query = {
			collection: config.get('users'),
			input: {
				"_id": username
			}
		};
		dbConnect.getUserData(query, function(result) {
			callback(result);
		});
	},

	/*
	 * updates the record array in group_expense collection
	 * depending on expenseId
	 * MongoDb updates the record by changing the order of the record chronologically
	 */
	insertExpense: function(expense, callback) {
		console.log('DB Access');
		var query = {
			collection: config.get("expenses"),
			input: {
				"_id": new ObjectID(expense.id)
			},
			update: {
				$push: {
					record: {
						"amount": expense.amount,
						"addedby": expense.addedby,
						"remarks": expense.remarks,
						"date": expense.date || new Date()
					}
				}
			}
		};
		dbConnect.insertExpense(query, function(result) {
			callback(result);
		});
	},

	/*
	 * Inserts new user object in user_expense collection
	 * note: inserted record has group =[] (empty)
	 */
	signUp: function(user, callback) {
		var query = {
			collection: config.get("users"),
			input: user
		};

		dbConnect.signUp(query, function(result) {
			callback(result);
		});
	},

	/*
	 * fetchs record corresponding to the username
	 * uses collection.aggregate to only fetch record corresponding to a particular user
	 * has to apply filterResultByMonth
	 */
	getExpensesByUserName: function(user, callback) {
		var query = {
			collection: config.get("expenses"),
			input: {
				"record.addedby": user.username
			},
			expenseName: {
				"_id": new ObjectID(user.expenseId)
			},
			output: {
				record: 1
			}
		}
		dbConnect.getExpensesByUserName(query, function(result) {
			callback(result);
		});
	},

	/*
	 * Fetches expense record for a given expenseId 
	 * and given month
	 * record pulled has no manual limit set
	 * record pulled is sorted with respect to date in descending order
	 *
	 */
	totalExpense: function(expenseId, callback) {
		var query = {
			collection: config.get('expenses'),
			filterExpense: {
				'_id': new ObjectID(expenseId)
			}
		}
		dbConnect.totalExpense(query, function(result) {
			callback(result);
		});
	},

	addNewExpense: function(expense, callback) {
		var query = {
			collectionExpense: config.get('expenses'),
			collectionUsers: config.get('users'),
			insert: expense,
			user: expense.users[0]
		};
		dbConnect.addNewExpense(query, function(result) {
			callback(result);
		});
	},

	addNewUserToExpense: function(data, callback) {
		var query = {
			collectionExpense: config.get('expenses'),
			collectionUsers: config.get('users'),
			inputExpense: {
				'_id': new ObjectID(data.expenseId)
			},
			inputUsers: {
				'_id': data.username
			},
			updateExpense: {
				$push: {
					'users': data.username
				}
			},
			updateUsers: {
				$push: {
					group: {
						'_id': new ObjectID(data.expenseId),
						'title': data.expenseTitle
					}
				}
			}
		};
		dbConnect.addNewUserToExpense(query, function(result) {
			callback(result);
		});
	}
};

module.exports = db;