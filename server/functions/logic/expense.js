var dbHelper = require('../database/dbHelper');
var debug = require('debug')('UserAction');
var helper = require('./helper')
var expense = {

	myExpenseList: function(req, res) {
		var username = req.body.username || req.params.username || '';
		var expenseId = req.body.expenseId || req.params.expenseId || '55d247db7717fa7ebaa603f7';
		console.log('User: ' + username);
		var user = {
			'username': username,
			'expenseId': expenseId
		}

		dbHelper.myExpenseList(user, function(params) {
			if (params) {
				var s = [];
				var temp;
				var rec = params[0].record;
				console.log('length: ', rec.length);
				for (var i = 0; i < rec.length; i++) {
					temp = {
						amount: rec[i].amount,
						remarks: rec[i].remarks,
						addedby: rec[i].addedby,
						date: rec[i].date.format()
					}
					s.push(temp);
				}

				res.json({
					"_id": params[0]._id,
					"record": s,
					"total": params[0].totalamount
				});
			} else {

				res.json({
					"status": 200,
					"message": "failure"
				});
			}
		});
	},

	totalExpense: function(req, res) {
		var expenseId = req.body.expenseId || req.params.expenseId || '55d247db7717fa7ebaa603f7';
		console.log('ExpenseId: ' + expenseId);

		var month = req.body.month || req.params.month || '8';
		dbHelper.totalExpense(expenseId, function(params) {
			if (params) {
				helper.filterResultByMonth(params[0], month, function(p) {
					res.json({
						'_id': p._id,
						'title': p.title,
						'users': p.users,
						'record': p.record
					});
				});

			} else {
				res.json({
					"status": 200,
					"message": "failure"
				});
			}
		});
	},

	addNewExpense: function(req, res) {
		var username = req.body.username || req.params.username || '';
		var expense = {
			title: req.body.title || 'demotitle',
			users: [username],
			record: []
		};

		dbHelper.addNewExpense(expense, function(params) {
			if (params) {
				res.json({
					"status": 200,
					"message": "success"
				});
			} else {
				res.json({
					"status": 200,
					"message": "failure"
				});
			}
		});
	},

	addNewUserToExpense: function(req, res) {
		var expenseId = req.body.expenseId || '';
		var username = req.body.username || '';
		var expenseTitle = req.body.expenseTitle || '';
		var data = {
				'expenseId': expenseId,
				'username': username,
				'expenseTitle': expenseTitle
			}
			// check for empty here

		dbHelper.addNewUserToExpense(data, function(params) {
			if (params) {
				res.json({
					"status": 200,
					"message": "success"
				});
			} else {
				res.json({
					"status": 200,
					"message": "failure"
				});
			}
		});
	}
};



module.exports = expense;