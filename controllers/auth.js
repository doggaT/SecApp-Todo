const bcrypt = require('bcryptjs');
const db = require('../database.js');
const { createToken } = require('../jwt.js');
require('dotenv').config();
const logger = require('../logger.js');
const { validationResult } = require('express-validator');

exports.signup = (req, res) => {
	const { name, email, password, passwordConfirm } = req.body;
	const csrfToken = req.csrfToken();

	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		logger.warn(validationErrors.array());
		res.redirect('/');
	} else {
		db.get('SELECT * FROM user WHERE email = ?', [email], async (err, user) => {
			if (err) {
				logger.error(err.message);
			}

			if (user) {
				let email = user.email;
				logger.warn({ email }, 'Email already exists.');
				return { message: 'Email already exists.' };
			} else if (password !== passwordConfirm) {
				logger.warn('Passwords are not a match.');
				return { message: "Passwords don't match." };
			}

			let hashedPassword = await bcrypt.hash(password, 8);
			let query = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
			db.run(query, [name, email, hashedPassword], (err, user) => {
				if (err) {
					logger.error(err.message);
				} else {
					logger.info({ name }, "User created with default role 'user'.");
					return res.render('../views/index', {
						message: `User successfully registered.`,
						csrfToken,
					});
				}
			});
		});
	}
};

exports.login = (req, res) => {
	const { email, password } = req.body;

	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		logger.warn(validationErrors.array());
		res.redirect('/');
	} else {
		let query = 'SELECT * FROM user WHERE email = ?';
		db.get(query, [email], (err, user) => {
			if (err) {
				logger.error(err.message);
			}

			if (!bcrypt.compare(password, user.password)) {
				logger.warn('Wrong email and password combination.');
				return res.render('../views/index', {
					message: 'Wrong email and password combination.',
				});
			} else {
				const accessToken = createToken(user);
				res.cookie('access-token', accessToken, {
					maxAge: process.env.JWT_EXPIRESIN,
					httpOnly: true,
				});
				logger.debug('Access token created');
				res.redirect('/tasks');
			}
		});
	}
};

exports.logout = (req, res) => {
	logger.info('User logged out.');
	res.cookie('access-token', '', { maxAge: 1 });
	res.redirect('/');
};
