const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const csrf = require('csurf');
const { body } = require('express-validator');

const csrfProtection = csrf({ cookie: true });

router.post(
	'/signup',
	body('name').trim().escape(),
	body('email').isEmail().trim().escape(),
	body('password').trim().isAlphanumeric().escape(),
	body('passwordConfirm').trim().isAlphanumeric().escape(),
	csrfProtection,
	authController.signup
);

router.post(
	'/login',
	body('email').isEmail().trim().escape(),
	body('password').trim().escape(),
	csrfProtection,
	authController.login
);

router.post('/logout', csrfProtection, authController.logout);

module.exports = router;
