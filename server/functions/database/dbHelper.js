var db = require('./dbAccess');

var dbHelper={
	//for SignUp
	userNameCheck:function(username,callback){
		db.userNameCheck(username,function (params) {
			callback(params);
		});
	},
	addNewUser:function(user,callback){
		db.addNewUser(user,function (params) {
			callback(params);
		});
	},
	insertExpense:function(expense,callback){
		db.insertExpense(expense,function(params){
			callback(params);
		})
	},
	myExpenseList:function(username,callback){
		db.myExpenseList(username,function(params){
			callback(params);
		})
	}
};

module.exports=dbHelper;