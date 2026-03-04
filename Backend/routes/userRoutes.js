const express = require('express');
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/userController');


router.post('/login', catchAsync(userController.loginUser));


router.post('/signup', catchAsync(userController.signupUser));

module.exports = router;