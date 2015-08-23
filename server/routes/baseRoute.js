var express = require('express');
var router = express.Router();

var user = require('../functions/logic/user');
var expense = require('../functions/logic/expense');

router.use('/user/signup/:username', user.signUp);
router.use('/user/login/:username', user.login);
router.use('/user/insert', user.insertExpense);

router.use('/expense/byUser/:username', expense.myExpenseList);
router.use('/expense/totalExpense/:expenseId', expense.totalExpense);
router.use('/expense/addnewexpense/:username',expense.addNewExpense);
router.use('/expense/adduser',expense.addNewUserToExpense);

module.exports = router;