var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var config = require('config');
var debug = require('debug')('DB');

var mongoClient = mongodb.MongoClient;

var conString = config.get('connectionString');

var db={	
	userNameCheck : function(username,callback){
		console.log('DB Access');
		var query={
			collection:config.get('users'),
			input:{ "username":username },
			output:{ _id:0 },
			operation: "find"
		};
		dbConnect(query,function (result) {
			if (result === false) {
				callback(false);
			}else{
				callback(result);
			}
		});		
	},
	insertExpense : function(expense,callback){
		console.log('DB Access');
		var query={
			collection:config.get("expenses"),
			input:{"_id":new ObjectID(expense.id)},
			update:{ "amount":expense.amount,
					"addedby":expense.addedby,
					"remarks":expense.remarks,
					"date":new Date()
				 },
			operation: "update"
		};
		dbConnect(query,function (result) {
			if (result === false) {
				callback(false);
			}else{
				callback(result);
			}
		});		
	},
	addNewUser : function(user,callback){
		var query={
			collection:config.get("users"),
			input:user,
			operation:"addNewUser"
		};
		
		dbConnect(query,function (params) {
			callback(params);
		});		
	},
	myExpenseList : function(username,callback){
		var query={
			collection : config.get("expenses"),
			input : {"record.addedby" : username},
			output:{},
			operation : "find"
		}
		getMyExpenseList(query,function (params) {
			callback(params);
		});	
	}
};


function getMyExpenseList(query,callback){
	mongoClient.connect(conString,function(err,db){
		if(err){
			console.error('error fetching client from pool'.err);
			callback(false);				
		}
		var collection = db.collection(query.collection);
		console.log('connected to remote database, '+query.operation+'/'+query.collection);
		
		if(query.operation === "find"){
			console.log('finding');
			
			collection.aggregate(
						{ $match: query.input },
					
						// This will create an 'intermediate' document for each record
						{ $unwind : "$record" },
					
						// Now filter out the documents 
						// Note: at this point, documents' 'tracks' element is not an array
						{ $match: query.input },
					
						// Re-group so the output documents have the same structure, ie.
						// make record a subdocument / array again
						{ $group : { _id : "$_id", record : { $push : "$record" } }}				 
						).toArray(function(err,result){
							if(err){			
								console.error('error running query',err);
								callback(false);
							}
							else{
								if(result.length){	
									console.log('Hello');					
									callback(result);
								}else{
									console.log("RESULT: "+result);
									callback(false);
								}
							}
						});
		}
	});
}

function dbConnect(query,callback){
	
	mongoClient.connect(conString,function(err,db){
		if(err){
			console.error('error fetching client from pool'.err);
			callback(false);				
		}
		var collection = db.collection(query.collection);
		console.log('connected to remote database, '+query.operation+'/'+query.collection);
		
		if(query.operation === "find"){
			console.log('finding');
			collection.find(query.input,query.output).toArray(function(err,result){
				if(err){			
					console.error('error running query',err);
					callback(false);
				}
				else{
					if(result.length){
						console.log("RESULT: "+result);
						callback(result);
					}else{
						console.log("RESULT: "+result);
						callback(false);
					}
				}
			});
		}
		else if(query.operation === "update"){
			collection.update(query.input,{$push : { "record": query.update } }, function(err, numUpdated) {
			if (err) {
				console.log(err);
			} else if (numUpdated.result.ok) {
				console.log(numUpdated.result);
				console.log('Updated Successfully %d document(s).', numUpdated.result.nModified);
				callback(true);
			} else {
				console.log('No document found with defined "find" criteria!');
				callback(false);
			}
			//Close connection
			db.close();
			});
		}
		else if(query.operation === "addNewUser"){
			collection.insert(query.input, function(err, result) {
			if (err) {
				console.log(err);
			} else if (result) {
				console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
				callback(true);
			} else {
				console.log('No document found with defined "find" criteria!');
				callback(false);
			}
			//Close connection
			db.close();
			});
		}
	});
	
}

module.exports = db;