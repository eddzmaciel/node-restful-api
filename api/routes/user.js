const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
//importing controllers
const UserController = require('../controllers/user.controller');

// we need to hash our password 
router.post('/signup', UserController.user_signup);

//request for token
router.post('/login', UserController.user_login);

//request for delete the user by id
router.delete('/:userId', checkAuth, UserController.user_delete);


module.exports = router;


