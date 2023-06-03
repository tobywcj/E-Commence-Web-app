const express = require('express');
const router = express.Router();
const passport = require('passport');

const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');



//* USER routes

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), catchAsync(users.login))

router.get('/logout', users.logout)



module.exports = router;