var dbHelper=require('../database/dbHelper');
var debug = require('debug')('UserAction');

var user={
	signUp:function(req,res){
		var username = req.body.username || req.query.username || '';
		
		if (username=='') {
			res.status(401);
			res.json({
				"status":401,
				"message":"UserName in mandatory."
			});
			return;
		}
		var user = {"username":username};
		
		dbHelper.addNewUser(user,function(inserted){ 
			debug('New User added: '+ inserted);
			if(inserted){
				res.json({
					"status":200,
					"message":"success"
				});
				
			}else{
				res.json({
					"status":200,
					"message":"failure"
				});
			}
		});
	},
	login:function(req,res){
		var username = req.body.username || req.query.username || '';
		console.log('username: '+username);
		dbHelper.userNameCheck(username,function(params){ 
			if(params){
				debug('User Found');			
				res.json(params);
				
			}else{
				debug('No User Found');			
				res.json({
					"status":200,
					"message":"failure"
				});
			}
		});
	},
	insertExpense:function(req,res){
		var body_expense = req.body.expense || '';
		var expense = {
			id: '55d247db7717fa7ebaa603f7',
			amount: 150,
			remarks:"BreakFast",
			addedby:"Peter"
		}
		console.log('Expense: '+ expense);		
		dbHelper.insertExpense(expense,function(params){ 
			if(params){		
				res.send('Updated');				
			}else{		
				res.json({
					"status":200,
					"message":"failure"
				});
			}
		});
	},
	myExpenseList:function(req,res){
		var username = req.body.username || req.params.username ||  '';
		console.log('User: '+username);
		dbHelper.myExpenseList(username,function(params){
			if(params){
				res.json(params);
			}else{
				res.json({
					"status":200,
					"message":"failure"
				});
			}
		});
	}
};



module.exports=user;