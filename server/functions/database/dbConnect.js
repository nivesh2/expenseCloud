var mongodb = require('mongodb');
var config = require('config');

var mongoClient = mongodb.MongoClient;
var connString = config.get('connectionString');

var connect = {
	getExpensesByUserName: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.error('error fetching client from pool' + err);
				callback(false);
			}
			var collection = db.collection(query.collection);
			console.log('connected getting Expenses by UserName /collection: ' + query.collection);

			collection.aggregate(
				[{
					$match: query.expenseName
				}, {
					$project: query.output
				}, {
					$unwind: "$record"
				}, {
					$match: query.input
				}, {
					$sort: {
						"record.date": -1
					}
				}, {
					$limit: 50
				}, {
					$group: {
						_id: "$_id",
						record: {
							$push: "$record"
						},
						totalamount: {
							$sum: "$record.amount"
						}
					}
				}]).toArray(function(err, result) {
				if (err) {
					console.error('error running query' + err);
					callback(false);
				} else {
					if (result.length) {
						console.log('Number of records: ' + result.length);
						callback(result);
					} else {
						console.log("No record found.");
						callback(result);
					}
				}
				//Close connection
				db.close();
			});

		});
	},

	getUserData: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.error('error fetching client from pool' + err);
				callback(false);
			}
			var collection = db.collection(query.collection);
			console.log('connected getting UserData by UserName /collection: ' + query.collection);

			collection.find(query.input).toArray(function(err, result) {
				if (err) {
					console.error('error running query', err);
					callback(false);
				} else {
					if (result.length) {
						console.log("RESULT: " + result);
						callback(result);
					} else {
						console.log("Not found.");
						callback(false);
					}
				}
				//Close connection
				db.close();
			});
		});
	},

	insertExpense: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.error('error fetching client from pool' + err);
				callback(false);
			}
			var collection = db.collection(query.collection);
			console.log('connected inserting Expense by ExpenseId /collection: ' + query.collection);

			collection.update(query.input, query.update, function(err, numUpdated) {
				if (err) {
					console.log(err);
				} else if (numUpdated.result.ok) {
					console.log(numUpdated.result);
					console.log('New expense record added to an Expense ', numUpdated.result.nModified);
					callback(true);
				} else {
					console.log('insertion of record Failed');
					callback(false);
				}
				//Close connection
				db.close();
			});
		});
	},

	signUp: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.error('error fetching client from pool' + err);
				callback(false);
			}
			var collection = db.collection(query.collection);
			console.log('connected adding new User /collection: ' + query.collection);

			collection.insert(query.input, function(err, result) {
				if (err) {
					console.log(err);
				} else if (result) {
					console.log('New User Added to Users collection', result.insertedCount);
					callback(result.ops[0]);
				} else {
					console.log('User not inserted.');
					callback(false);
				}
				//Close connection
				db.close();
			});
		});
	},
	totalExpense: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.error('error fetching client from pool' + err);
				callback(false);
			}
			var collection = db.collection(query.collection);
			console.log('fetching total expense record /collection: ' + query.collection);
			collection.find(query.filterExpense).toArray(function(err, result) {
				if (err) {
					console.error('error running query' + err);
					callback(false);
				} else {
					if (result.length) {
						console.log('Number of records: ' + result.length);
						callback(result);
					} else {
						console.log("No record found.");
						callback(false);
					}
				}
				//Close connection
				db.close();
			});
		});
	},
	addNewExpense: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.error('error fetching client from pool' + err);
				callback(false);
			}
			var collectionExpense = db.collection(query.collectionExpense);
			var collectionUsers = db.collection(query.collectionUsers);
			console.log('Creating new Expense /collection: ' + query.collection);

			collectionExpense.insert(query.insert, function(err, result) {
				if (err) {
					console.log(err);
				} else if (result) {
					console.log('Created New Expense ', result.insertedCount);

					collectionUsers.update({
						'username': query.user
					}, {
						$push: {
							'group': {
								'_id': result.ops[0]._id,
								'title': result.ops[0].title
							}
						}
					}, function(err, numUpdated) {
						if (err) {
							console.log(err);
						} else if (numUpdated.result.ok) {
							console.log(numUpdated.result);
							console.log('Updated User document with New Expense', numUpdated.result.nModified);
							callback(true);
						} else {
							console.log('Updation Failed');
							callback(false);
						}
						//Close connection
						db.close();
					});
				} else {
					console.log('Expense not inserted');
					callback(false);
				}
			});

		});
	},
	addNewUserToExpense: function(query, callback) {
		mongoClient.connect(connString, function(err, db) {
			if (err) {
				console.log('Error while fetching mongoDb connection');
			}

			var collectionExpense = db.collection(query.collectionExpense);
			var collectionUsers = db.collection(query.collectionUsers);

			collectionExpense.update(query.inputExpense, query.updateExpense, function(err, numUpdated) {
				if (err) {
					console.log(err);
					callback(false);
				} else if (numUpdated.result.ok) {
					console.log('New User added to Expense document ', numUpdated.result.nModified);
					collectionUsers.update(query.inputUsers, query.updateUsers, function(err, numUpdated) {
						if (err) {
							console.log(err);
							callback(false);
						} else if (numUpdated.result.ok) {
							console.log('New Expense added to User document ', numUpdated.result.nModified);
							callback(true);
						} else {
							callback(false);
						}
						//Close connection
						db.close();
					});
				} else {
					callback(false);
				}
			});
		});
	}
};

module.exports = connect;