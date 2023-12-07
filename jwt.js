const { sign, verify, decode } = require('jsonwebtoken');
const logger = require('./logger');
require('dotenv').config();

const createToken = user => {
	const accessToken = sign(
		{ user: { id: user.id, username: user.name, email: user.email } },
		process.env.JWT_SECRET
	);
	return accessToken;
};

const validateToken = (req, res, next) => {
	const accessToken = req.cookies['access-token'];

	if (!accessToken) {
		return res.render('/', {
			message: 'User not authenticated.',
		});
	}

	try {
		const validToken = verify(accessToken, process.env.JWT_SECRET);

		if (validToken) {
			req.authenticated = true;
			return next();
		}
	} catch (err) {
		logger.error(err.message);
	}
};

const decodeToken = token => {
	return decode(token);
};

module.exports = { createToken, validateToken, decodeToken };
