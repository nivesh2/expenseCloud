var express = require('express');
var router = express.Router();

var user = require('../functions/logic/user');

router.use('/user/login',user.login);
router.use('/user/insert',user.insertExpense);
router.use('/user/myExpenseList/:username',user.myExpenseList);

module.exports = router; 