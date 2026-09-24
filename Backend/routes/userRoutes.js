const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/userController');

router.post('/login', userController.loginUser);
router.post('/signup', userController.signupUser);
router.post('/refresh', userController.refreshToken);
router.post('/logout', userController.logoutUser);

module.exports = router;